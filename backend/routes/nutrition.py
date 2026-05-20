from fastapi import APIRouter, HTTPException, Header
from typing import Optional, Dict
from backend.models.nutrition import (
    FoodLogCreate,
    FoodLogResponse,
    WaterLogCreate,
    WaterLogResponse,
    NutritionDashboardResponse,
    FoodLogOverviewResponse
)
from backend.services.nutrition_service import (
    save_food_log,
    save_water_log,
    get_nutrition_dashboard,
    get_food_log_overview,
    get_food_presets,
    get_food_details
)
from backend.database.connection import get_supabase_client

router = APIRouter(tags=["Nutrition"])


def get_current_user_id(authorization: Optional[str]) -> str:
    print(f"[NUTRITION ROUTE] Authorization header: {'present' if authorization else 'MISSING'}")

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")

    token = authorization.replace("Bearer ", "").strip()

    try:
        supabase = get_supabase_client()

        # Verify token using Supabase Auth
        resp = supabase.auth.get_user(token)

        if not resp or not resp.user:
            raise HTTPException(status_code=401, detail="Invalid token")

        user_id = resp.user.id
        print(f"[NUTRITION ROUTE] ✓ user_id={user_id}")
        return user_id

    except Exception as e:
        print(f"[NUTRITION ROUTE] ✗ Auth failed: {e}")
        raise HTTPException(status_code=401, detail=f"Auth failed: {str(e)}")


# ── POST /api/nutrition/log ──────────────────────────────────────────────────
@router.post("/log", response_model=FoodLogResponse)
def log_food(
    payload: FoodLogCreate,
    authorization: Optional[str] = Header(None)
):
    user_id = get_current_user_id(authorization)
    user_token = authorization.replace("Bearer ", "").strip()

    try:
        data = save_food_log(user_id, payload, user_token)
        return data
    except Exception as e:
        print(f"[NUTRITION ROUTE] log_food error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── POST /api/nutrition/water ────────────────────────────────────────────────
@router.post("/water", response_model=WaterLogResponse)
def log_water(
    payload: WaterLogCreate,
    authorization: Optional[str] = Header(None)
):
    user_id = get_current_user_id(authorization)
    user_token = authorization.replace("Bearer ", "").strip()

    try:
        data = save_water_log(user_id, payload, user_token)
        return data
    except Exception as e:
        print(f"[NUTRITION ROUTE] log_water error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── GET /api/nutrition/dashboard ─────────────────────────────────────────────
@router.get("/dashboard", response_model=NutritionDashboardResponse)
def nutrition_dashboard(
    authorization: Optional[str] = Header(None)
):
    user_id = get_current_user_id(authorization)
    user_token = authorization.replace("Bearer ", "").strip()

    try:
        data = get_nutrition_dashboard(user_id, user_token)
        return data
    except Exception as e:
        print(f"[NUTRITION ROUTE] nutrition_dashboard error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── GET /api/nutrition/food-log/today ─────────────────────────────────────────
@router.get("/food-log/today", response_model=FoodLogOverviewResponse)
def food_log_overview(
    authorization: Optional[str] = Header(None)
):
    user_id = get_current_user_id(authorization)
    user_token = authorization.replace("Bearer ", "").strip()

    try:
        data = get_food_log_overview(user_id, user_token)
        return data
    except Exception as e:
        print(f"[NUTRITION ROUTE] food_log_overview error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── GET /api/nutrition/foods/presets ──────────────────────────────────────────
@router.get("/foods/presets")
def get_presets():
    try:
        return get_food_presets()
    except Exception as e:
        print(f"[NUTRITION ROUTE] get_presets error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── GET /api/nutrition/foods/{food_name} ──────────────────────────────────────
@router.get("/foods/{food_name}")
def get_details(food_name: str):
    try:
        data = get_food_details(food_name)
        if not data:
            raise HTTPException(status_code=404, detail="Food details not found")
        return data
    except Exception as e:
        print(f"[NUTRITION ROUTE] get_details error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
