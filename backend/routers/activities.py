from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from supabase import create_client
from services.calories import calculate_calories
from dotenv import load_dotenv
import os

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env.local'))

router = APIRouter()

supabase = create_client(
    os.getenv("EXPO_PUBLIC_SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

class ActivityCreate(BaseModel):
    activity_type: str
    duration: int
    intensity: str
    notes: str = ""

def get_user_id(authorization: str) -> str:
    try:
        token = authorization.replace("Bearer ", "")
        user = supabase.auth.get_user(token)
        return user.user.id
    except:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

# CORE 1: Log activity
@router.post("/log")
def log_activity(body: ActivityCreate, authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    calories = calculate_calories(body.activity_type, body.duration, body.intensity)

    result = supabase.table("activities").insert({
        "user_id": user_id,
        "activity_type": body.activity_type,
        "duration": body.duration,
        "intensity": body.intensity,
        "calories_burned": calories,
        "notes": body.notes
    }).execute()

    if not result.data:
        raise HTTPException(status_code=400, detail="Lưu thất bại")

    return {"message": "Lưu thành công!", "data": result.data[0]}

# ✅ THÊM MỚI: Test không cần token


# CORE 2: Lịch sử
@router.get("/history")
def get_history(authorization: str = Header(...)):
    user_id = get_user_id(authorization)

    result = supabase.table("activities") \
        .select("*") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .execute()

    return {"data": result.data, "count": len(result.data)}

# CORE 2: Chi tiết

    # Lấy danh sách bài tập theo activity_type và intensity
@router.get("/exercises")
def get_exercises(
    activity_type: str,
    intensity: str
):
    result = supabase.table("workout_exercises") \
        .select("*") \
        .eq("activity_type", activity_type) \
        .eq("intensity", intensity) \
        .order("order_index") \
        .execute()
    
    return {
        "activity_type": activity_type,
        "intensity": intensity,
        "exercises": result.data,
        "count": len(result.data)
    }
@router.get("/{activity_id}")
def get_detail(activity_id: str, authorization: str = Header(...)):
    user_id = get_user_id(authorization)

    result = supabase.table("activities") \
        .select("*") \
        .eq("id", activity_id) \
        .eq("user_id", user_id) \
        .execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Không tìm thấy")
    return {"data": result.data[0]}