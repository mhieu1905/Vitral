from fastapi import APIRouter, HTTPException, Header
from supabase import create_client
from dotenv import load_dotenv
from datetime import date
import os

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env.local'))

router = APIRouter()

_supabase = None

def get_supabase():
    global _supabase
    if _supabase is None:
        from supabase import create_client
        url = os.getenv("EXPO_PUBLIC_SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY")
        if not url or not key:
            from database.connection import get_supabase_client
            client = get_supabase_client()
            raise RuntimeError(f"Supabase credentials not found in env. URL={bool(url)}, KEY={bool(key)}")
        _supabase = create_client(url, key)
    return _supabase

def get_user_id(authorization: str) -> str:
    try:
        token = authorization.replace("Bearer ", "")
        user = get_supabase().auth.get_user(token)
        return user.user.id
    except:
        raise HTTPException(status_code=401, detail="Unauthorized")

# CORE 3: Summary hôm nay
@router.get("/today")
def get_today_summary(authorization: str = Header(...)):
    user_id = get_user_id(authorization)
    today = date.today().isoformat()

    result = get_supabase().table("activities") \
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

    result = get_supabase().table("activities") \
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