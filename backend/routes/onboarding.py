from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any
from uuid import UUID
from typing import Any

from models.user_health_profile import (
    UserHealthProfile,
    UserHealthProfileCreate,
    UserHealthProfileUpdate
)
from services.onboarding_service import OnboardingService
from database.connection import get_supabase_client

router = APIRouter(
    prefix="/onboarding",
    tags=["Onboarding"]
)

# Dependency to get the OnboardingService with an injected DB client
def get_onboarding_service(db: Any = Depends(get_supabase_client)) -> OnboardingService:
    return OnboardingService(db)

@router.post("/profile", response_model=UserHealthProfile, status_code=status.HTTP_201_CREATED)
def create_profile(
    profile_data: UserHealthProfileCreate,
    service: OnboardingService = Depends(get_onboarding_service)
) -> Any:
    """
    Save user onboarding data.
    Automatically calculates TDEE and calorie goal based on provided health metrics.
    """
    try:
        return service.create_user_profile(profile_data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create profile: {str(e)}"
        )

@router.get("/profile/{user_id}", response_model=UserHealthProfile)
def get_profile(
    user_id: UUID,
    service: OnboardingService = Depends(get_onboarding_service)
) -> Any:
    """
    Get the health profile for a specific user.
    """
    try:
        return service.get_user_profile(user_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving profile: {str(e)}"
        )

@router.put("/profile/{user_id}", response_model=UserHealthProfile)
def update_profile(
    user_id: UUID,
    profile_data: UserHealthProfileUpdate,
    service: OnboardingService = Depends(get_onboarding_service)
) -> Any:
    """
    Update a user's health profile.
    Automatically recalculates TDEE and calorie goal if relevant metrics change.
    """
    try:
        return service.update_user_profile(user_id, profile_data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update profile: {str(e)}"
        )
