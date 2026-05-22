from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# ── Food Log Schemas ──────────────────────────────────────────────────────────
class FoodLogCreate(BaseModel):
    food_name: str = Field(..., min_length=1, description="Name of the food item")
    meal_type: str = Field(..., description="Meal type: 'breakfast', 'lunch', 'dinner', 'snacks'")
    calories: float = Field(..., ge=0, description="Calories in kcal")
    protein_g: Optional[float] = Field(0.0, ge=0)
    carbs_g: Optional[float] = Field(0.0, ge=0)
    fat_g: Optional[float] = Field(0.0, ge=0)
    serving_size: Optional[str] = Field("", description="e.g. '1 slice', '100g'")
    serving_qty: Optional[float] = Field(1.0, ge=0)
    logged_at: Optional[datetime] = None

class FoodLogResponse(BaseModel):
    id: UUID
    user_id: UUID
    food_name: str
    meal_type: str
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    serving_size: str
    serving_qty: float
    logged_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True


# ── Water Log Schemas ─────────────────────────────────────────────────────────
class WaterLogCreate(BaseModel):
    amount_ml: float = Field(..., gt=0, description="Amount of water logged in milliliters")
    logged_at: Optional[datetime] = None

class WaterLogResponse(BaseModel):
    id: UUID
    user_id: UUID
    amount_ml: float
    logged_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True


# ── Hydration History Schemas ────────────────────────────────────────────────
class HydrationHistoryDay(BaseModel):
    day: str
    value: float
    isToday: bool


# ── Dashboard Sub-schemas (S-37) ──────────────────────────────────────────────
class MacroIntake(BaseModel):
    label: str  # Carbohydrates, Protein, Fats
    current: str  # e.g., "180g"
    total: str  # e.g., "250g"
    pct: float  # e.g., 0.72
    color: str  # Hex or Tailwind/Theme color

class DashboardMealItem(BaseModel):
    id: str  # "b", "l", "d", "s"
    title: str  # "Breakfast", "Lunch", "Dinner", "Snacks"
    desc: str  # e.g., "Greek Yogurt, Berries" or "Not logged yet"
    kcal: Optional[str] = None  # e.g., "420 KCAL"
    time: str  # e.g., "08:30 AM" or "Plan: 07:30 PM"
    empty: bool = False

class NutritionalInsight(BaseModel):
    title: str
    desc: str

class NutritionDashboardResponse(BaseModel):
    calories_target: int
    calories_consumed: int
    calories_remaining: int
    calories_burned: int
    pct: float
    water_goal_l: float
    water_intake_l: float
    macros: List[MacroIntake]
    meals: List[DashboardMealItem]
    insight: NutritionalInsight


# ── Food Log Overview Sub-schemas (S-38) ──────────────────────────────────────
class FoodLogItemData(BaseModel):
    id: str
    title: str
    meta: str  # e.g. "1 slice • 210 kcal"

class FoodLogSectionData(BaseModel):
    id: str  # "b", "l", "d", "s"
    title: str  # "Breakfast", "Lunch", "Dinner", "Snacks"
    consumed: str  # e.g., "320 kcal consumed"
    items: List[FoodLogItemData]

class MacroPieData(BaseModel):
    label: str  # "Carbs", "Protein", "Fats"
    value: str  # "145g"
    pct: float  # 0.55

class FoodLogOverviewResponse(BaseModel):
    consumed: int
    goal: int
    remaining: int
    pct: float
    sections: List[FoodLogSectionData]
    macro_pies: List[MacroPieData]
