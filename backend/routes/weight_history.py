from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any, List
from uuid import UUID

from models.weight_history import WeightHistoryCreate, WeightHistoryRecord
from services.weight_history_service import WeightHistoryService
from database.connection import get_supabase_client

router = APIRouter(
    prefix="/health",
    tags=["Health"]
)


def get_weight_history_service(db: Any = Depends(get_supabase_client)) -> WeightHistoryService:
    return WeightHistoryService(db)


@router.post("/weight-history", response_model=WeightHistoryRecord, status_code=status.HTTP_201_CREATED)
def add_weight_record(
    data: WeightHistoryCreate,
    service: WeightHistoryService = Depends(get_weight_history_service)
) -> Any:
    """
    Add a new weight record for a user.
    Used when the user updates their weight in the profile editor.
    """
    try:
        return service.add_weight_record(data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to add weight record: {str(e)}"
        )


@router.get("/weight-history/{user_id}", response_model=List[WeightHistoryRecord])
def get_weight_history(
    user_id: UUID,
    limit: int = 30,
    service: WeightHistoryService = Depends(get_weight_history_service)
) -> Any:
    """
    Get weight history for a user, ordered by most recent first.
    Supports dashboard analytics and progress tracking.
    """
    try:
        return service.get_weight_history(user_id, limit)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving weight history: {str(e)}"
        )


@router.get("/weight-history/{user_id}/latest")
def get_latest_weight(
    user_id: UUID,
    service: WeightHistoryService = Depends(get_weight_history_service)
) -> Any:
    """
    Get the most recent weight for a user.
    Returns null if no weight records exist.
    """
    try:
        weight = service.get_latest_weight(user_id)
        return {"weight": weight}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving latest weight: {str(e)}"
        )
