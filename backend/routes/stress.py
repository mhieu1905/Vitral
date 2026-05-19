from fastapi import APIRouter, HTTPException, Header
from backend.models.stress_log import (
    StressLogCreate,
    StressLogResponse,
    StressStats,
)
from backend.services.stress_service import (
    save_stress_log,
    get_stress_history,
    get_stress_stats,
)
from backend.database.connection import get_supabase_client
from typing import List, Optional

router = APIRouter(prefix="/stress", tags=["Stress"])


def get_current_user_id(authorization: Optional[str]) -> str:
    print(f"[STRESS] Authorization header: {'present' if authorization else 'MISSING'}")

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")

    token = authorization.replace("Bearer ", "").strip()

    try:
        supabase = get_supabase_client()

        # verify token bằng Supabase Auth
        resp = supabase.auth.get_user(token)

        if not resp or not resp.user:
            raise HTTPException(status_code=401, detail="Invalid token")

        user_id = resp.user.id

        print(f"[STRESS] ✓ user_id={user_id}")

        return user_id

    except Exception as e:
        print(f"[STRESS] ✗ Auth failed: {e}")
        raise HTTPException(status_code=401, detail=str(e))


# ── POST /stress/log ──────────────────────────────────────────────────────────
@router.post("/log", response_model=StressLogResponse)
def log_stress(
    payload: StressLogCreate,
    authorization: Optional[str] = Header(None),
):
    user_id = get_current_user_id(authorization)

    # lấy token từ header
    user_token = authorization.replace("Bearer ", "").strip()

    try:
        # truyền token xuống service
        data = save_stress_log(user_id, payload, user_token)

        return data

    except Exception as e:
        print(f"[STRESS] save_stress_log error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── GET /stress/history ───────────────────────────────────────────────────────
@router.get("/history", response_model=List[StressLogResponse])
def stress_history(limit: int = 30, authorization: Optional[str] = Header(None)):
    user_id    = get_current_user_id(authorization)
    user_token = authorization.replace("Bearer ", "").strip()  # ← có chưa?
    data = get_stress_history(user_id, limit, user_token)      # ← truyền token chưa?
    return data


# ── GET /stress/stats ─────────────────────────────────────────────────────────
# Đúng
@router.get("/stats", response_model=StressStats)
def stress_stats(authorization: Optional[str] = Header(None)):
    user_id    = get_current_user_id(authorization)
    user_token = authorization.replace("Bearer ", "").strip()  # ← thêm
    return get_stress_stats(user_id, user_token)               # ← truyền token