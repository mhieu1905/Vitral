import httpx
import os
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
from uuid import UUID
from concurrent.futures import ThreadPoolExecutor
from backend.models.nutrition import (
    FoodLogCreate,
    FoodLogResponse,
    WaterLogCreate,
    WaterLogResponse,
    NutritionDashboardResponse,
    MacroIntake,
    DashboardMealItem,
    NutritionalInsight,
    FoodLogOverviewResponse,
    FoodLogSectionData,
    FoodLogItemData,
    MacroPieData,
    HydrationHistoryDay
)

SUPABASE_URL = (
    os.environ.get("SUPABASE_URL") or
    os.environ.get("EXPO_PUBLIC_SUPABASE_URL", "")
)

def _headers(user_token: str) -> dict:
    anon_key = (
        os.environ.get("SUPABASE_KEY") or
        os.environ.get("EXPO_PUBLIC_SUPABASE_KEY", "")
    )
    return {
        "apikey":        anon_key,
        "Authorization": f"Bearer {user_token}",
        "Content-Type":  "application/json",
    }

# ── Food Log Operations ───────────────────────────────────────────────────────

def save_food_log(user_id: str, payload: FoodLogCreate, user_token: str) -> dict:
    url = f"{SUPABASE_URL}/rest/v1/food_logs"
    logged_at = payload.logged_at or datetime.now(timezone.utc)
    
    body = [{
        "user_id":      user_id,
        "food_name":    payload.food_name,
        "meal_type":    payload.meal_type.lower(),
        "calories":     payload.calories,
        "protein_g":    payload.protein_g,
        "carbs_g":      payload.carbs_g,
        "fat_g":        payload.fat_g,
        "serving_size": payload.serving_size or "",
        "serving_qty":  payload.serving_qty or 1.0,
        "logged_at":    logged_at.isoformat()
    }]
    h = _headers(user_token)
    h["Prefer"] = "return=representation"

    print(f"[NUTRITION SERVICE] SAVE FOOD log user={user_id} food={payload.food_name}")
    resp = httpx.post(url, headers=h, json=body, timeout=10.0)
    
    if not resp.is_success:
        raise RuntimeError(f"Failed to log food: {resp.text}")
        
    return resp.json()[0]

def get_today_food_logs(user_id: str, user_token: str) -> List[dict]:
    url = f"{SUPABASE_URL}/rest/v1/food_logs"
    today_str = datetime.now().date().isoformat()
    start_str = f"{today_str}T00:00:00"
    
    params = {
        "user_id":   f"eq.{user_id}",
        "logged_at": f"gte.{start_str}",
        "order":     "logged_at.asc",
        "select":    "*"
    }
    
    print(f"[NUTRITION SERVICE] FETCH TODAY FOOD user={user_id} since={start_str}")
    resp = httpx.get(url, headers=_headers(user_token), params=params, timeout=10.0)
    
    if not resp.is_success:
        print(f"[NUTRITION SERVICE] Fetch today food logs failed: {resp.text}")
        return []
        
    return resp.json()


# ── Water Log Operations ──────────────────────────────────────────────────────

def save_water_log(user_id: str, payload: WaterLogCreate, user_token: str) -> dict:
    url = f"{SUPABASE_URL}/rest/v1/water_logs"
    logged_at = payload.logged_at or datetime.now(timezone.utc)
    
    body = [{
        "user_id":   user_id,
        "amount_ml": payload.amount_ml,
        "logged_at": logged_at.isoformat()
    }]
    h = _headers(user_token)
    h["Prefer"] = "return=representation"

    print(f"[NUTRITION SERVICE] SAVE WATER log user={user_id} amount={payload.amount_ml}ml")
    resp = httpx.post(url, headers=h, json=body, timeout=10.0)
    
    if not resp.is_success:
        raise RuntimeError(f"Failed to log water: {resp.text}")
        
    return resp.json()[0]

def get_today_water_logs(user_id: str, user_token: str) -> List[dict]:
    url = f"{SUPABASE_URL}/rest/v1/water_logs"
    today_str = datetime.now().date().isoformat()
    start_str = f"{today_str}T00:00:00"
    
    params = {
        "user_id":   f"eq.{user_id}",
        "logged_at": f"gte.{start_str}",
        "select":    "*"
    }
    
    resp = httpx.get(url, headers=_headers(user_token), params=params, timeout=10.0)
    if not resp.is_success:
        print(f"[NUTRITION SERVICE] Fetch today water logs failed: {resp.text}")
        return []
        
    return resp.json()


def get_hydration_history(user_id: str, user_token: str, days: int = 7) -> List[HydrationHistoryDay]:
    """Return hydration totals per day for the last N days (inclusive of today)."""
    if days < 1:
        days = 1
    if days > 31:
        days = 31

    url = f"{SUPABASE_URL}/rest/v1/water_logs"
    today = datetime.now(timezone.utc).date()
    start_date = today - timedelta(days=days - 1)
    start_str = f"{start_date.isoformat()}T00:00:00"

    params = {
        "user_id": f"eq.{user_id}",
        "logged_at": f"gte.{start_str}",
        "order": "logged_at.asc",
        "select": "amount_ml,logged_at",
    }

    resp = httpx.get(url, headers=_headers(user_token), params=params, timeout=10.0)
    if not resp.is_success:
        print(f"[NUTRITION SERVICE] Fetch hydration history failed: {resp.text}")
        return [
            HydrationHistoryDay(
                day=(start_date + timedelta(days=i)).strftime("%a"),
                value=0,
                isToday=(start_date + timedelta(days=i)) == today,
            )
            for i in range(days)
        ]

    logs = resp.json() or []

    totals: Dict[str, float] = {}
    for row in logs:
        try:
            logged_at_raw = row.get("logged_at")
            if not logged_at_raw:
                continue
            dt = datetime.fromisoformat(str(logged_at_raw).replace("Z", "+00:00"))
            day_key = dt.date().isoformat()
            totals[day_key] = totals.get(day_key, 0.0) + float(row.get("amount_ml") or 0)
        except Exception:
            continue

    out: List[HydrationHistoryDay] = []
    for i in range(days):
        d = start_date + timedelta(days=i)
        key = d.isoformat()
        out.append(
            HydrationHistoryDay(
                day=d.strftime("%a"),
                value=totals.get(key, 0.0),
                isToday=d == today,
            )
        )

    return out


# ── User Profile & Active Calories Helpers ────────────────────────────────────

def get_user_nutrition_targets(user_id: str, user_token: str) -> dict:
    """
    Retrieves user targets from onboarding health profile or computes default targets.
    """
    url = f"{SUPABASE_URL}/rest/v1/user_health_profiles"
    params = {
        "user_id": f"eq.{user_id}",
        "select":  "*"
    }
    
    # Defaults (Matching design spec constants)
    targets = {
        "calories": 2400,
        "water_goal_l": 2.5,
        "protein_g": 120,
        "carbs_g": 250,
        "fat_g": 70
    }
    
    try:
        resp = httpx.get(url, headers=_headers(user_token), params=params, timeout=10.0)
        if resp.is_success and resp.json():
            profile = resp.json()[0]
            calorie_goal = profile.get("calorie_goal")
            if calorie_goal:
                cal = int(calorie_goal)
                targets["calories"] = cal
                # Standard active fitness division: 25% Protein, 50% Carbs, 25% Fat
                targets["protein_g"] = int((cal * 0.25) / 4)
                targets["carbs_g"] = int((cal * 0.50) / 4)
                targets["fat_g"] = int((cal * 0.25) / 9)
            
            # Use water goal based on body weight if available: 35ml per kg of body weight
            weight = profile.get("weight_kg")
            if weight:
                targets["water_goal_l"] = round((float(weight) * 35) / 1000, 1)
    except Exception as e:
        print(f"[NUTRITION SERVICE] Error fetching user profile targets: {e}")
        
    return targets

def get_today_active_calories(user_id: str, user_token: str) -> float:
    """
    Sums active calories burned today from user logged activities in activities table.
    """
    url = f"{SUPABASE_URL}/rest/v1/activities"
    today_str = datetime.now().date().isoformat()
    start_str = f"{today_str}T00:00:00"
    
    params = {
        "user_id":    f"eq.{user_id}",
        "created_at": f"gte.{start_str}",
        "select":     "calories_burned"
    }
    
    try:
        resp = httpx.get(url, headers=_headers(user_token), params=params, timeout=10.0)
        if resp.is_success:
            activities = resp.json()
            return sum(float(a.get("calories_burned", 0)) for a in activities)
    except Exception as e:
        print(f"[NUTRITION SERVICE] Error fetching active calories burned: {e}")
        
    return 0.0


# ── Nutrition Dashboard Compilation (S-37) ────────────────────────────────────

def get_nutrition_dashboard(user_id: str, user_token: str) -> NutritionDashboardResponse:
    # 1. Fetch targets, logs and active calories concurrently
    with ThreadPoolExecutor(max_workers=4) as executor:
        f_targets = executor.submit(get_user_nutrition_targets, user_id, user_token)
        f_foods = executor.submit(get_today_food_logs, user_id, user_token)
        f_water = executor.submit(get_today_water_logs, user_id, user_token)
        f_calories = executor.submit(get_today_active_calories, user_id, user_token)
        
        t = f_targets.result()
        food_logs = f_foods.result()
        water_logs = f_water.result()
        active_calories = f_calories.result()
    
    # 3. Aggregate food values
    consumed_cal = sum(float(f["calories"]) for f in food_logs)
    consumed_protein = sum(float(f.get("protein_g", 0)) for f in food_logs)
    consumed_carbs = sum(float(f.get("carbs_g", 0)) for f in food_logs)
    consumed_fat = sum(float(f.get("fat_g", 0)) for f in food_logs)
    
    # 4. Calorie calculations
    target_cal = t["calories"]
    remaining_cal = int(target_cal - consumed_cal + active_calories)
    pct = round(consumed_cal / target_cal, 2) if target_cal > 0 else 0.0
    
    # 5. Water calculations
    water_intake_ml = sum(float(w["amount_ml"]) for w in water_logs)
    # Do not round aggressively here; FE converts liters->ml and expects exact increments like 250ml.
    water_intake_l = round(water_intake_ml / 1000.0, 3)
    
    # 6. Macros Intake
    macros = [
        MacroIntake(
            label="Carbohydrates",
            current=f"{int(consumed_carbs)}g",
            total=f"{t['carbs_g']}g",
            pct=round(consumed_carbs / t['carbs_g'], 2) if t['carbs_g'] > 0 else 0.0,
            color="#A8C5A0" # Sage
        ),
        MacroIntake(
            label="Protein",
            current=f"{int(consumed_protein)}g",
            total=f"{t['protein_g']}g",
            pct=round(consumed_protein / t['protein_g'], 2) if t['protein_g'] > 0 else 0.0,
            color="#ABBEDE" # BlueLight
        ),
        MacroIntake(
            label="Fats",
            current=f"{int(consumed_fat)}g",
            total=f"{t['fat_g']}g",
            pct=round(consumed_fat / t['fat_g'], 2) if t['fat_g'] > 0 else 0.0,
            color="#EED8C5" # Light Peach
        )
    ]
    
    # 7. Today's Meals Compilation
    meals_dict = {
        "breakfast": {"title": "Breakfast", "foods": [], "cal": 0.0, "time": "08:30 AM"},
        "lunch":     {"title": "Lunch", "foods": [], "cal": 0.0, "time": "01:15 PM"},
        "dinner":    {"title": "Dinner", "foods": [], "cal": 0.0, "time": "07:30 PM"},
        "snacks":    {"title": "Snacks", "foods": [], "cal": 0.0, "time": "04:45 PM"}
    }
    
    for f in food_logs:
        mtype = f["meal_type"].lower()
        if mtype in meals_dict:
            meals_dict[mtype]["foods"].append(f["food_name"])
            meals_dict[mtype]["cal"] += float(f["calories"])
            # Format time from ISO
            try:
                dt = datetime.fromisoformat(f["logged_at"].replace("Z", "+00:00"))
                meals_dict[mtype]["time"] = dt.strftime("%I:%M %p")
            except Exception:
                pass

    meals = []
    for mkey, mval in meals_dict.items():
        is_empty = len(mval["foods"]) == 0
        desc = ", ".join(mval["foods"]) if not is_empty else "Not logged yet"
        kcal_str = f"{int(mval['cal'])} KCAL" if not is_empty else None
        time_str = mval["time"] if not is_empty else f"Plan: {mval['time']}"
        
        meals.append(
            DashboardMealItem(
                id=mkey[0], # "b", "l", "d", "s"
                title=mval["title"],
                desc=desc,
                kcal=kcal_str,
                time=time_str,
                empty=is_empty
            )
        )
        
    # Order meals: Breakfast, Lunch, Snacks, Dinner to match constants
    meals_ordered = []
    for code in ["b", "l", "d", "s"]:
        for m in meals:
            if m.id == code:
                meals_ordered.append(m)
                break

    # 8. Generate Nutritional Insight based on progress
    insight_title = "Nutritional Insight"
    protein_pct = round(consumed_protein / t['protein_g'] * 100) if t['protein_g'] > 0 else 0
    if protein_pct >= 80:
        insight_desc = f"Excellent! You've reached {protein_pct}% of your protein goal today. This is exceptional for muscle repair and fat burning."
    elif protein_pct > 0:
        insight_desc = f"You've reached {protein_pct}% of your protein goal today. Increasing your intake slightly during dinner will help with muscle recovery after your activities."
    else:
        insight_desc = "No protein logged yet today. Adding eggs, Greek yogurt, or fish to your next meal will help you reach your daily structural vital goals."

    return NutritionDashboardResponse(
        calories_target=int(target_cal),
        calories_consumed=int(consumed_cal),
        calories_remaining=remaining_cal,
        calories_burned=int(active_calories),
        pct=pct,
        water_goal_l=t["water_goal_l"],
        water_intake_l=water_intake_l,
        macros=macros,
        meals=meals_ordered,
        insight=NutritionalInsight(title=insight_title, desc=insight_desc)
    )


# ── Food Log Overview Compilation (S-38) ──────────────────────────────────────

def get_food_log_overview(user_id: str, user_token: str) -> FoodLogOverviewResponse:
    # 1. Fetch targets and food logs concurrently
    with ThreadPoolExecutor(max_workers=2) as executor:
        f_targets = executor.submit(get_user_nutrition_targets, user_id, user_token)
        f_foods = executor.submit(get_today_food_logs, user_id, user_token)
        
        t = f_targets.result()
        food_logs = f_foods.result()
    
    # 3. Aggregate totals
    consumed_cal = sum(float(f["calories"]) for f in food_logs)
    consumed_protein = sum(float(f.get("protein_g", 0)) for f in food_logs)
    consumed_carbs = sum(float(f.get("carbs_g", 0)) for f in food_logs)
    consumed_fat = sum(float(f.get("fat_g", 0)) for f in food_logs)
    
    # 4. Overview calculations
    goal = t["calories"]
    remaining = int(goal - consumed_cal)
    pct = round(consumed_cal / goal, 2) if goal > 0 else 0.0
    
    # 5. Build Meal Sections
    sections_map = {
        "breakfast": {"title": "Breakfast", "consumed": 0.0, "items": []},
        "lunch":     {"title": "Lunch", "consumed": 0.0, "items": []},
        "dinner":    {"title": "Dinner", "consumed": 0.0, "items": []},
        "snacks":    {"title": "Snacks", "consumed": 0.0, "items": []}
    }
    
    for f in food_logs:
        mtype = f["meal_type"].lower()
        if mtype in sections_map:
            sections_map[mtype]["consumed"] += float(f["calories"])
            meta_str = f"{f['serving_qty']} {f['serving_size']} • {int(f['calories'])} kcal" if f['serving_size'] else f"{int(f['calories'])} kcal"
            sections_map[mtype]["items"].append(
                FoodLogItemData(
                    id=str(f["id"]),
                    title=f["food_name"],
                    meta=meta_str
                )
            )
            
    sections = []
    # Build order breakfast, lunch, dinner, snacks
    for mkey in ["breakfast", "lunch", "dinner", "snacks"]:
        mval = sections_map[mkey]
        sections.append(
            FoodLogSectionData(
                id=mkey[0], # "b", "l", "d", "s"
                title=mval["title"],
                consumed=f"{int(mval['consumed'])} kcal consumed",
                items=mval["items"]
            )
        )
        
    # 6. Macro Pies Data
    macro_pies = [
        MacroPieData(
            label="Carbs",
            value=f"{int(consumed_carbs)}g",
            pct=round(consumed_carbs / t['carbs_g'], 2) if t['carbs_g'] > 0 else 0.0
        ),
        MacroPieData(
            label="Protein",
            value=f"{int(consumed_protein)}g",
            pct=round(consumed_protein / t['protein_g'], 2) if t['protein_g'] > 0 else 0.0
        ),
        MacroPieData(
            label="Fats",
            value=f"{int(consumed_fat)}g",
            pct=round(consumed_fat / t['fat_g'], 2) if t['fat_g'] > 0 else 0.0
        )
    ]
    
    return FoodLogOverviewResponse(
        consumed=int(consumed_cal),
        goal=int(goal),
        remaining=remaining,
        pct=pct,
        sections=sections,
        macro_pies=macro_pies
    )


# ── Food Detail Presets (S-40) ────────────────────────────────────────────────

PRESET_FOODS = {
    "avocado_toast": {
        "title": "Avocado & Sourdough",
        "subtitle": "Artisan Breakfast Selection",
        "totalKcal": 340,
        "macros": [
            {"label": "Carbohydrates", "value": "42g", "pct": 0.60, "labelColor": "#6FA3C7", "barColor": "#B5C8E8"},
            {"label": "Protein", "value": "12g", "pct": 0.25, "labelColor": "#4B6546", "barColor": "#A8C5A0"},
            {"label": "Fats", "value": "18g", "pct": 0.45, "labelColor": "#D99393", "barColor": "#F5D3D3"}
        ],
        "servingLabel": "SERVING SIZE",
        "servingValue": "1 Slice (85g)",
        "factGroups": [
            {
                "rows": [
                    {"label": "Total Fat", "value": "18g"},
                    {"label": "Saturated Fat", "value": "3.5g", "sub": True}
                ]
            },
            {
                "rows": [
                    {"label": "Cholesterol", "value": "0mg"},
                    {"label": "Sodium", "value": "310mg"}
                ]
            },
            {
                "rows": [
                    {"label": "Total Carbohydrate", "value": "42g"},
                    {"label": "Dietary Fiber", "value": "11g", "sub": True},
                    {"label": "Total Sugars", "value": "2g", "sub": True}
                ]
            },
            {"rows": [{"label": "Protein", "value": "12g"}]}
        ],
        "vitamins": [
            {"label": "Vitamin D", "value": "0%"},
            {"label": "Calcium", "value": "8%"},
            {"label": "Iron", "value": "15%"},
            {"label": "Potassium", "value": "12%"}
        ]
    },
    "greek_yogurt": {
        "title": "Organic Greek Yogurt",
        "subtitle": "High Protein Cultured Selection",
        "totalKcal": 120,
        "macros": [
            {"label": "Carbohydrates", "value": "8g", "pct": 0.15, "labelColor": "#6FA3C7", "barColor": "#B5C8E8"},
            {"label": "Protein", "value": "12g", "pct": 0.65, "labelColor": "#4B6546", "barColor": "#A8C5A0"},
            {"label": "Fats", "value": "4g", "pct": 0.20, "labelColor": "#D99393", "barColor": "#F5D3D3"}
        ],
        "servingLabel": "SERVING SIZE",
        "servingValue": "1 Container (150g)",
        "factGroups": [
            {
                "rows": [
                    {"label": "Total Fat", "value": "4g"},
                    {"label": "Saturated Fat", "value": "2.5g", "sub": True}
                ]
            },
            {
                "rows": [
                    {"label": "Cholesterol", "value": "15mg"},
                    {"label": "Sodium", "value": "50mg"}
                ]
            },
            {
                "rows": [
                    {"label": "Total Carbohydrate", "value": "8g"},
                    {"label": "Dietary Fiber", "value": "0g", "sub": True},
                    {"label": "Total Sugars", "value": "4g", "sub": True}
                ]
            },
            {"rows": [{"label": "Protein", "value": "12g"}]}
        ],
        "vitamins": [
            {"label": "Vitamin D", "value": "10%"},
            {"label": "Calcium", "value": "15%"},
            {"label": "Iron", "value": "0%"},
            {"label": "Potassium", "value": "6%"}
        ]
    },
    "oat_milk_latte": {
        "title": "Iced Oat Latte",
        "subtitle": "Creamy Espresso Refresher",
        "totalKcal": 110,
        "macros": [
            {"label": "Carbohydrates", "value": "16g", "pct": 0.35, "labelColor": "#6FA3C7", "barColor": "#B5C8E8"},
            {"label": "Protein", "value": "2g", "pct": 0.10, "labelColor": "#4B6546", "barColor": "#A8C5A0"},
            {"label": "Fats", "value": "4g", "pct": 0.20, "labelColor": "#D99393", "barColor": "#F5D3D3"}
        ],
        "servingLabel": "SERVING SIZE",
        "servingValue": "1 Cup (350ml)",
        "factGroups": [
            {
                "rows": [
                    {"label": "Total Fat", "value": "4g"},
                    {"label": "Saturated Fat", "value": "0.5g", "sub": True}
                ]
            },
            {
                "rows": [
                    {"label": "Cholesterol", "value": "0mg"},
                    {"label": "Sodium", "value": "100mg"}
                ]
            },
            {
                "rows": [
                    {"label": "Total Carbohydrate", "value": "16g"},
                    {"label": "Dietary Fiber", "value": "2g", "sub": True},
                    {"label": "Total Sugars", "value": "9g", "sub": True}
                ]
            },
            {"rows": [{"label": "Protein", "value": "2g"}]}
        ],
        "vitamins": [
            {"label": "Vitamin D", "value": "0%"},
            {"label": "Calcium", "value": "10%"},
            {"label": "Iron", "value": "4%"},
            {"label": "Potassium", "value": "8%"}
        ]
    },
    "premium_beefsteak": {
        "title": "Premium Beefsteak",
        "subtitle": "Structural Protein Selection",
        "totalKcal": 380,
        "macros": [
            {"label": "Carbohydrates", "value": "1g", "pct": 0.01, "labelColor": "#6FA3C7", "barColor": "#B5C8E8"},
            {"label": "Protein", "value": "28g", "pct": 0.58, "labelColor": "#4B6546", "barColor": "#A8C5A0"},
            {"label": "Fats", "value": "24g", "pct": 0.35, "labelColor": "#D99393", "barColor": "#F5D3D3"}
        ],
        "servingLabel": "SERVING SIZE",
        "servingValue": "1 Serving (200g)",
        "factGroups": [
            {
                "rows": [
                    {"label": "Total Fat", "value": "24g"},
                    {"label": "Saturated Fat", "value": "9.5g", "sub": True}
                ]
            },
            {
                "rows": [
                    {"label": "Cholesterol", "value": "85mg"},
                    {"label": "Sodium", "value": "420mg"}
                ]
            },
            {
                "rows": [
                    {"label": "Total Carbohydrate", "value": "1g"},
                    {"label": "Dietary Fiber", "value": "0g", "sub": True},
                    {"label": "Total Sugars", "value": "0g", "sub": True}
                ]
            },
            {"rows": [{"label": "Protein", "value": "28g"}]}
        ],
        "vitamins": [
            {"label": "Vitamin D", "value": "2%"},
            {"label": "Calcium", "value": "2%"},
            {"label": "Iron", "value": "22%"},
            {"label": "Potassium", "value": "14%"}
        ]
    },
    "traditional_pho_bo": {
        "title": "Traditional Phở Bò",
        "subtitle": "Vietnamese Noodle Selection",
        "totalKcal": 450,
        "macros": [
            {"label": "Carbohydrates", "value": "55g", "pct": 0.22, "labelColor": "#6FA3C7", "barColor": "#B5C8E8"},
            {"label": "Protein", "value": "18g", "pct": 0.38, "labelColor": "#4B6546", "barColor": "#A8C5A0"},
            {"label": "Fats", "value": "12g", "pct": 0.17, "labelColor": "#D99393", "barColor": "#F5D3D3"}
        ],
        "servingLabel": "SERVING SIZE",
        "servingValue": "1 Bowl (500g)",
        "factGroups": [
            {
                "rows": [
                    {"label": "Total Fat", "value": "12g"},
                    {"label": "Saturated Fat", "value": "3.5g", "sub": True}
                ]
            },
            {
                "rows": [
                    {"label": "Cholesterol", "value": "45mg"},
                    {"label": "Sodium", "value": "980mg"}
                ]
            },
            {
                "rows": [
                    {"label": "Total Carbohydrate", "value": "55g"},
                    {"label": "Dietary Fiber", "value": "2g", "sub": True},
                    {"label": "Total Sugars", "value": "2g", "sub": True}
                ]
            },
            {"rows": [{"label": "Protein", "value": "18g"}]}
        ],
        "vitamins": [
            {"label": "Vitamin D", "value": "0%"},
            {"label": "Calcium", "value": "4%"},
            {"label": "Iron", "value": "12%"},
            {"label": "Potassium", "value": "8%"}
        ]
    },
    "broken_rice_com_tam": {
        "title": "Broken Rice (Cơm Tấm)",
        "subtitle": "Broken Rice Selection",
        "totalKcal": 650,
        "macros": [
            {"label": "Carbohydrates", "value": "75g", "pct": 0.30, "labelColor": "#6FA3C7", "barColor": "#B5C8E8"},
            {"label": "Protein", "value": "24g", "pct": 0.50, "labelColor": "#4B6546", "barColor": "#A8C5A0"},
            {"label": "Fats", "value": "22g", "pct": 0.31, "labelColor": "#D99393", "barColor": "#F5D3D3"}
        ],
        "servingLabel": "SERVING SIZE",
        "servingValue": "1 Plate (350g)",
        "factGroups": [
            {
                "rows": [
                    {"label": "Total Fat", "value": "22g"},
                    {"label": "Saturated Fat", "value": "6.5g", "sub": True}
                ]
            },
            {
                "rows": [
                    {"label": "Cholesterol", "value": "65mg"},
                    {"label": "Sodium", "value": "680mg"}
                ]
            },
            {
                "rows": [
                    {"label": "Total Carbohydrate", "value": "75g"},
                    {"label": "Dietary Fiber", "value": "3g", "sub": True},
                    {"label": "Total Sugars", "value": "4g", "sub": True}
                ]
            },
            {"rows": [{"label": "Protein", "value": "24g"}]}
        ],
        "vitamins": [
            {"label": "Vitamin D", "value": "2%"},
            {"label": "Calcium", "value": "6%"},
            {"label": "Iron", "value": "14%"},
            {"label": "Potassium", "value": "10%"}
        ]
    },
    "vietnamese_banh_mi": {
        "title": "Vietnamese Bánh Mì",
        "subtitle": "Crusty Baguette Selection",
        "totalKcal": 380,
        "macros": [
            {"label": "Carbohydrates", "value": "48g", "pct": 0.19, "labelColor": "#6FA3C7", "barColor": "#B5C8E8"},
            {"label": "Protein", "value": "11g", "pct": 0.23, "labelColor": "#4B6546", "barColor": "#A8C5A0"},
            {"label": "Fats", "value": "13g", "pct": 0.19, "labelColor": "#D99393", "barColor": "#F5D3D3"}
        ],
        "servingLabel": "SERVING SIZE",
        "servingValue": "1 Loaf (120g)",
        "factGroups": [
            {
                "rows": [
                    {"label": "Total Fat", "value": "13g"},
                    {"label": "Saturated Fat", "value": "4.5g", "sub": True}
                ]
            },
            {
                "rows": [
                    {"label": "Cholesterol", "value": "30mg"},
                    {"label": "Sodium", "value": "540mg"}
                ]
            },
            {
                "rows": [
                    {"label": "Total Carbohydrate", "value": "48g"},
                    {"label": "Dietary Fiber", "value": "2g", "sub": True},
                    {"label": "Total Sugars", "value": "3g", "sub": True}
                ]
            },
            {"rows": [{"label": "Protein", "value": "11g"}]}
        ],
        "vitamins": [
            {"label": "Vitamin D", "value": "0%"},
            {"label": "Calcium", "value": "4%"},
            {"label": "Iron", "value": "8%"},
            {"label": "Potassium", "value": "6%"}
        ]
    },
    "grilled_chicken_power_bowl": {
        "title": "Grilled Chicken Power Bowl",
        "subtitle": "Lean Protein Selection",
        "totalKcal": 640,
        "macros": [
            {"label": "Carbohydrates", "value": "42g", "pct": 0.17, "labelColor": "#6FA3C7", "barColor": "#B5C8E8"},
            {"label": "Protein", "value": "42g", "pct": 0.88, "labelColor": "#4B6546", "barColor": "#A8C5A0"},
            {"label": "Fats", "value": "18g", "pct": 0.26, "labelColor": "#D99393", "barColor": "#F5D3D3"}
        ],
        "servingLabel": "SERVING SIZE",
        "servingValue": "1 Bowl (400g)",
        "factGroups": [
            {
                "rows": [
                    {"label": "Total Fat", "value": "18g"},
                    {"label": "Saturated Fat", "value": "3.5g", "sub": True}
                ]
            },
            {
                "rows": [
                    {"label": "Cholesterol", "value": "95mg"},
                    {"label": "Sodium", "value": "480mg"}
                ]
            },
            {
                "rows": [
                    {"label": "Total Carbohydrate", "value": "42g"},
                    {"label": "Dietary Fiber", "value": "6g", "sub": True},
                    {"label": "Total Sugars", "value": "2g", "sub": True}
                ]
            },
            {"rows": [{"label": "Protein", "value": "42g"}]}
        ],
        "vitamins": [
            {"label": "Vitamin D", "value": "0%"},
            {"label": "Calcium", "value": "8%"},
            {"label": "Iron", "value": "18%"},
            {"label": "Potassium", "value": "16%"}
        ]
    },
    "lemon_garlic_salmon": {
        "title": "Lemon Garlic Salmon",
        "subtitle": "Omega-3 Salmon Selection",
        "totalKcal": 580,
        "macros": [
            {"label": "Carbohydrates", "value": "8g", "pct": 0.03, "labelColor": "#6FA3C7", "barColor": "#B5C8E8"},
            {"label": "Protein", "value": "38g", "pct": 0.79, "labelColor": "#4B6546", "barColor": "#A8C5A0"},
            {"label": "Fats", "value": "24g", "pct": 0.34, "labelColor": "#D99393", "barColor": "#F5D3D3"}
        ],
        "servingLabel": "SERVING SIZE",
        "servingValue": "1 Portion (250g)",
        "factGroups": [
            {
                "rows": [
                    {"label": "Total Fat", "value": "24g"},
                    {"label": "Saturated Fat", "value": "4.5g", "sub": True}
                ]
            },
            {
                "rows": [
                    {"label": "Cholesterol", "value": "75mg"},
                    {"label": "Sodium", "value": "380mg"}
                ]
            },
            {
                "rows": [
                    {"label": "Total Carbohydrate", "value": "8g"},
                    {"label": "Dietary Fiber", "value": "1g", "sub": True},
                    {"label": "Total Sugars", "value": "1g", "sub": True}
                ]
            },
            {"rows": [{"label": "Protein", "value": "38g"}]}
        ],
        "vitamins": [
            {"label": "Vitamin D", "value": "25%"},
            {"label": "Calcium", "value": "4%"},
            {"label": "Iron", "value": "8%"},
            {"label": "Potassium", "value": "12%"}
        ]
    },
    "teriyaki_tofu_bowl": {
        "title": "Teriyaki Tofu Bowl",
        "subtitle": "Plant Based Selection",
        "totalKcal": 620,
        "macros": [
            {"label": "Carbohydrates", "value": "68g", "pct": 0.27, "labelColor": "#6FA3C7", "barColor": "#B5C8E8"},
            {"label": "Protein", "value": "28g", "pct": 0.58, "labelColor": "#4B6546", "barColor": "#A8C5A0"},
            {"label": "Fats", "value": "12g", "pct": 0.17, "labelColor": "#D99393", "barColor": "#F5D3D3"}
        ],
        "servingLabel": "SERVING SIZE",
        "servingValue": "1 Bowl (400g)",
        "factGroups": [
            {
                "rows": [
                    {"label": "Total Fat", "value": "12g"},
                    {"label": "Saturated Fat", "value": "1.5g", "sub": True}
                ]
            },
            {
                "rows": [
                    {"label": "Cholesterol", "value": "0mg"},
                    {"label": "Sodium", "value": "620mg"}
                ]
            },
            {
                "rows": [
                    {"label": "Total Carbohydrate", "value": "68g"},
                    {"label": "Dietary Fiber", "value": "8g", "sub": True},
                    {"label": "Total Sugars", "value": "6g", "sub": True}
                ]
            },
            {"rows": [{"label": "Protein", "value": "28g"}]}
        ],
        "vitamins": [
            {"label": "Vitamin D", "value": "0%"},
            {"label": "Calcium", "value": "20%"},
            {"label": "Iron", "value": "25%"},
            {"label": "Potassium", "value": "10%"}
        ]
    },
    "mediterranean_lentil_bowl": {
        "title": "Mediterranean Lentil Bowl",
        "subtitle": "Fiber Rich Selection",
        "totalKcal": 560,
        "macros": [
            {"label": "Carbohydrates", "value": "62g", "pct": 0.25, "labelColor": "#6FA3C7", "barColor": "#B5C8E8"},
            {"label": "Protein", "value": "28g", "pct": 0.58, "labelColor": "#4B6546", "barColor": "#A8C5A0"},
            {"label": "Fats", "value": "10g", "pct": 0.14, "labelColor": "#D99393", "barColor": "#F5D3D3"}
        ],
        "servingLabel": "SERVING SIZE",
        "servingValue": "1 Bowl (400g)",
        "factGroups": [
            {
                "rows": [
                    {"label": "Total Fat", "value": "10g"},
                    {"label": "Saturated Fat", "value": "1.0g", "sub": True}
                ]
            },
            {
                "rows": [
                    {"label": "Cholesterol", "value": "0mg"},
                    {"label": "Sodium", "value": "410mg"}
                ]
            },
            {
                "rows": [
                    {"label": "Total Carbohydrate", "value": "62g"},
                    {"label": "Dietary Fiber", "value": "12g", "sub": True},
                    {"label": "Total Sugars", "value": "4g", "sub": True}
                ]
            },
            {"rows": [{"label": "Protein", "value": "28g"}]}
        ],
        "vitamins": [
            {"label": "Vitamin D", "value": "0%"},
            {"label": "Calcium", "value": "10%"},
            {"label": "Iron", "value": "30%"},
            {"label": "Potassium", "value": "14%"}
        ]
    }
}

def get_food_presets() -> Dict[str, dict]:
    return PRESET_FOODS

VIETNAMESE_FOOD_KEYWORDS = [
    {"keywords": ["phở", "pho"], "title": "Traditional Phở", "kcal": 450, "carbs": 55, "protein": 18, "fat": 12, "serving": "1 Bowl (500g)", "sub": "Traditional Vietnamese Noodle Soup"},
    {"keywords": ["cơm", "com"], "title": "Vietnamese Rice Dish", "kcal": 550, "carbs": 75, "protein": 15, "fat": 14, "serving": "1 Plate (350g)", "sub": "Rice Selection"},
    {"keywords": ["bún", "bun"], "title": "Noodle Dish", "kcal": 420, "carbs": 60, "protein": 14, "fat": 10, "serving": "1 Bowl (450g)", "sub": "Noodle Selection"},
    {"keywords": ["bánh mì", "banh mi", "bánh mi", "banh my"], "title": "Vietnamese Bánh Mì", "kcal": 380, "carbs": 48, "protein": 11, "fat": 13, "serving": "1 Loaf (120g)", "sub": "Crusty Baguette Selection"},
    {"keywords": ["trà sữa", "milktea"], "title": "Pearl Milk Tea", "kcal": 450, "carbs": 68, "protein": 4, "fat": 15, "serving": "1 Cup (500ml)", "sub": "Sweet Refreshment"},
    {"keywords": ["cà phê", "cafe", "coffee", "latte", "bạc xỉu", "bac xiu"], "title": "Vietnamese Coffee", "kcal": 150, "carbs": 22, "protein": 3, "fat": 6, "serving": "1 Glass (200ml)", "sub": "Brewed Energy Refresher"},
    {"keywords": ["lẩu", "hotpot"], "title": "Hotpot Portion", "kcal": 650, "carbs": 45, "protein": 35, "fat": 28, "serving": "1 Portion (600g)", "sub": "Mindful Hotpot Sharing"},
    {"keywords": ["chè", "che"], "title": "Traditional Sweet Soup", "kcal": 320, "carbs": 58, "protein": 3, "fat": 7, "serving": "1 Cup (250g)", "sub": "Sweet Treat"},
    {"keywords": ["sữa chua", "yogurt"], "title": "Yogurt Cup", "kcal": 110, "carbs": 12, "protein": 5, "fat": 3, "serving": "1 Cup (100g)", "sub": "Probiotics Pro Selection"},
    {"keywords": ["trứng", "egg"], "title": "Organic Eggs", "kcal": 140, "carbs": 1, "protein": 12, "fat": 10, "serving": "2 Eggs (100g)", "sub": "High Protein Staple"},
    {"keywords": ["salad", "rau"], "title": "Fresh Garden Salad", "kcal": 90, "carbs": 12, "protein": 2, "fat": 4, "serving": "1 Bowl (200g)", "sub": "Fiber Rich Greens"},
    {"keywords": ["gà", "chicken"], "title": "Chicken Cuisine", "kcal": 280, "carbs": 2, "protein": 26, "fat": 15, "serving": "1 Portion (150g)", "sub": "Lean Protein Selection"},
    {"keywords": ["bò", "beef"], "title": "Beef Cuisine", "kcal": 320, "carbs": 1, "protein": 24, "fat": 18, "serving": "1 Portion (150g)", "sub": "Structural Protein Selection"},
    {"keywords": ["heo", "lợn", "pork"], "title": "Pork Cuisine", "kcal": 350, "carbs": 1, "protein": 22, "fat": 22, "serving": "1 Portion (150g)", "sub": "Rich Protein Selection"},
]

def get_food_details(food_name: str) -> Optional[dict]:
    # 1. Try direct key
    normalized = food_name.lower().replace(" & ", "_").replace(" ", "_")
    if normalized in PRESET_FOODS:
        return PRESET_FOODS[normalized]
        
    # 2. Loose match title in presets
    for key, data in PRESET_FOODS.items():
        if normalized in key or key in normalized or data["title"].lower() in food_name.lower():
            return data

    # 3. Smart Estimation based on Vietnamese & English keywords
    query_lower = food_name.lower()
    for item in VIETNAMESE_FOOD_KEYWORDS:
        for kw in item["keywords"]:
            if kw in query_lower:
                print(f"[NUTRITION SERVICE] [OK] Smart matched keyword '{kw}' for query '{food_name}'")
                
                # Dynamically construct a custom food details dictionary
                kcal = item["kcal"]
                carbs = item["carbs"]
                protein = item["protein"]
                fat = item["fat"]
                
                # Check for double modifiers (e.g. "cơm gà" = cơm + gà)
                if kw == "cơm" or kw == "com":
                    if "gà" in query_lower or "chicken" in query_lower:
                        kcal += 150
                        protein += 15
                        fat += 8
                    elif "bò" in query_lower or "beef" in query_lower:
                        kcal += 180
                        protein += 18
                        fat += 10
                        
                return {
                    "title": food_name.title(),
                    "subtitle": item["sub"],
                    "totalKcal": kcal,
                    "macros": [
                        {"label": "Carbohydrates", "value": f"{carbs}g", "pct": round(carbs/250.0, 2), "labelColor": "#6FA3C7", "barColor": "#B5C8E8"},
                        {"label": "Protein", "value": f"{protein}g", "pct": round(protein/120.0, 2), "labelColor": "#4B6546", "barColor": "#A8C5A0"},
                        {"label": "Fats", "value": f"{fat}g", "pct": round(fat/70.0, 2), "labelColor": "#D99393", "barColor": "#F5D3D3"}
                    ],
                    "servingLabel": "SERVING SIZE",
                    "servingValue": item["serving"],
                    "factGroups": [
                        {
                            "rows": [
                                {"label": "Total Fat", "value": f"{fat}g"},
                                {"label": "Saturated Fat", "value": f"{round(fat * 0.2, 1)}g", "sub": True}
                            ]
                        },
                        {
                            "rows": [
                                {"label": "Cholesterol", "value": "45mg" if protein > 15 else "0mg"},
                                {"label": "Sodium", "value": "480mg" if "phở" in query_lower or "lẩu" in query_lower or "bún" in query_lower else "180mg"}
                            ]
                        },
                        {
                            "rows": [
                                {"label": "Total Carbohydrate", "value": f"{carbs}g"},
                                {"label": "Dietary Fiber", "value": "2g" if carbs > 20 else "0g", "sub": True},
                                {"label": "Total Sugars", "value": "12g" if "trà sữa" in query_lower or "chè" in query_lower else "2g", "sub": True}
                            ]
                        },
                        {"rows": [{"label": "Protein", "value": f"{protein}g"}]}
                    ],
                    "vitamins": [
                        {"label": "Vitamin D", "value": "2%"},
                        {"label": "Calcium", "value": "6%"},
                        {"label": "Iron", "value": "10%"},
                        {"label": "Potassium", "value": "8%"}
                    ]
                }
            
    # 4. Default fallback: create a dynamic generic object with the custom name
    print(f"[NUTRITION SERVICE] No keyword matched for '{food_name}'. Fallback to generic template.")
    return {
        "title": food_name.title(),
        "subtitle": "Mindful Selection",
        "totalKcal": 280,
        "macros": [
            {"label": "Carbohydrates", "value": "35g", "pct": 0.14, "labelColor": "#6FA3C7", "barColor": "#B5C8E8"},
            {"label": "Protein", "value": "10g", "pct": 0.08, "labelColor": "#4B6546", "barColor": "#A8C5A0"},
            {"label": "Fats", "value": "8g", "pct": 0.11, "labelColor": "#D99393", "barColor": "#F5D3D3"}
        ],
        "servingLabel": "SERVING SIZE",
        "servingValue": "1 Portion (150g)",
        "factGroups": [
            {
                "rows": [
                    {"label": "Total Fat", "value": "8g"},
                    {"label": "Saturated Fat", "value": "1.5g", "sub": True}
                ]
            },
            {
                "rows": [
                    {"label": "Cholesterol", "value": "0mg"},
                    {"label": "Sodium", "value": "150mg"}
                ]
            },
            {
                "rows": [
                    {"label": "Total Carbohydrate", "value": "35g"},
                    {"label": "Dietary Fiber", "value": "1g", "sub": True},
                    {"label": "Total Sugars", "value": "2g", "sub": True}
                ]
            },
            {"rows": [{"label": "Protein", "value": "10g"}]}
        ],
        "vitamins": [
            {"label": "Vitamin D", "value": "0%"},
            {"label": "Calcium", "value": "4%"},
            {"label": "Iron", "value": "6%"},
            {"label": "Potassium", "value": "4%"}
        ]
    }

