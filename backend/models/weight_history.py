from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class WeightHistoryCreate(BaseModel):
    """Schema for adding a new weight record."""
    user_id: UUID = Field(..., description="The user's UUID from auth system")
    weight: float = Field(..., gt=0, description="Weight in kilograms")


class WeightHistoryRecord(BaseModel):
    """Schema for returning a weight history record from the database."""
    id: UUID
    user_id: UUID
    weight: float
    recorded_at: datetime

    class Config:
        from_attributes = True
