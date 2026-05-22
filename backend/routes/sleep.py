from fastapi import APIRouter, HTTPException, Header
import time
from typing import Optional

from backend.database.connection import get_supabase_client
from backend.models.sleep import SleepUpsertCreate, SleepTodayResponse, SleepHistoryResponse
from backend.services.sleep_service import upsert_sleep_today, get_sleep_today, get_sleep_history

router = APIRouter(tags=["Sleep"])

# Best-effort cache to reduce repeated auth.get_user(token) calls
_TOKEN_USER_CACHE: dict[str, tuple[str, float]] = {}
_TOKEN_USER_CACHE_TTL_SEC = 300


def get_current_user_id(authorization: Optional[str]) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")

    token = authorization.replace("Bearer ", "").strip()

    now = time.time()
    cached = _TOKEN_USER_CACHE.get(token)
    if cached and cached[1] > now:
        return cached[0]

    try:
        supabase = get_supabase_client()
        resp = supabase.auth.get_user(token)
        if not resp or not resp.user:
            raise HTTPException(status_code=401, detail="Invalid token")
        user_id = resp.user.id
        _TOKEN_USER_CACHE[token] = (user_id, now + _TOKEN_USER_CACHE_TTL_SEC)
        return user_id
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Auth failed: {str(e)}")


@router.post("/today")
def upsert_today(
    payload: SleepUpsertCreate,
    authorization: Optional[str] = Header(None),
):
    user_id = get_current_user_id(authorization)
    user_token = authorization.replace("Bearer ", "").strip()

    try:
        return upsert_sleep_today(user_id, payload, user_token)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"[SLEEP ROUTE] upsert_today error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/today", response_model=SleepTodayResponse)
def get_today(
    log_date: Optional[str] = None,
    authorization: Optional[str] = Header(None),
):
    user_id = get_current_user_id(authorization)
    user_token = authorization.replace("Bearer ", "").strip()

    try:
        return get_sleep_today(user_id, user_token, log_date=log_date)
    except Exception as e:
        print(f"[SLEEP ROUTE] get_today error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history", response_model=SleepHistoryResponse)
def history(
    days: int = 7,
    end_date: Optional[str] = None,
    authorization: Optional[str] = Header(None),
):
    user_id = get_current_user_id(authorization)
    user_token = authorization.replace("Bearer ", "").strip()

    try:
        return get_sleep_history(user_id, user_token, days=days, end_date=end_date)
    except Exception as e:
        print(f"[SLEEP ROUTE] history error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
