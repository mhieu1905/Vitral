from fastapi import APIRouter, HTTPException, Header
from backend.models.recommendation import RecommendationResponse
from backend.services.recommendation_service import get_recommendations
from backend.database.connection import get_supabase_client
from typing import Optional

router = APIRouter(prefix="/recommend", tags=["Recommendations"])


def get_current_user_id(authorization: Optional[str]) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    token    = authorization.replace("Bearer ", "").strip()
    supabase = get_supabase_client()
    try:
        resp = supabase.auth.get_user(token)
        return resp.user.id
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.get("", response_model=RecommendationResponse)
def recommendations(authorization: Optional[str] = Header(None)):
    user_id    = get_current_user_id(authorization)
    user_token = authorization.replace("Bearer ", "").strip()
    return get_recommendations(user_id, user_token)