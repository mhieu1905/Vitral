from fastapi import APIRouter, HTTPException, Header
from supabase import create_client
from dotenv import load_dotenv
from datetime import date
import os

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env.local'))

router = APIRouter()

supabase = create_client(
    os.getenv("EXPO_PUBLIC_SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)
def get_user_id(authorization: str) -> str:
    try:
        token = authorization.replace("Bearer ", "")
        user = supabase.auth.get_user(token)
        return user.user.id
    except:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

# CORE 3: Summary hôm nay
@router.get("/today")
def get_today_summary(authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    today = date.today().isoformat()

    result = supabase.table("activities") \
        .select("calories_burned, duration, activity_type") \
        .eq("user_id", user_id) \
        .gte("created_at", f"{today}T00:00:00") \
        .lte("created_at", f"{today}T23:59:59") \
        .execute()

    data = result.data
    return {
        "date": today,
        "total_calories": round(sum(a["calories_burned"] for a in data), 2),
        "total_duration": sum(a["duration"] for a in data),
        "activity_count": len(data),
        "activities": data
    }

# CORE 3: Summary theo ngày
@router.get("/{target_date}")
def get_summary_by_date(target_date: str, authorization: str = Header(...)):
    user_id = get_user_id(authorization)

    result = supabase.table("activities") \
        .select("calories_burned, duration, activity_type") \
        .eq("user_id", user_id) \
        .gte("created_at", f"{target_date}T00:00:00") \
        .lte("created_at", f"{target_date}T23:59:59") \
        .execute()

    data = result.data
    return {
        "date": target_date,
        "total_calories": round(sum(a["calories_burned"] for a in data), 2),
        "total_duration": sum(a["duration"] for a in data),
        "activity_count": len(data),
    }