from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime, time
from uuid import UUID
from enum import Enum

# Define Enums to match PostgreSQL Enum types
class HealthGoal(str, Enum):
    lose_weight = 'lose_weight'
    maintain_weight = 'maintain_weight'
    gain_weight = 'gain_weight'
    build_muscle = 'build_muscle'
    improve_fitness = 'improve_fitness'

class GenderType(str, Enum):
    male = 'male'
    female = 'female'
    other = 'other'
    prefer_not_to_say = 'prefer_not_to_say'

class ActivityLevel(str, Enum):
    sedentary = 'sedentary'
    lightly_active = 'lightly_active'
    moderately_active = 'moderately_active'
    very_active = 'very_active'
    extra_active = 'extra_active'

# Base Schema for shared properties
class UserHealthProfileBase(BaseModel):
    goal: HealthGoal
    height_cm: float = Field(..., gt=0, description="Height in centimeters")
    weight_kg: float = Field(..., gt=0, description="Weight in kilograms")
    age: int = Field(..., gt=0, description="Age in years")
    gender: GenderType
    activity_level: ActivityLevel
    
    # Optional fields that might be calculated or set later
    tdee: Optional[float] = Field(None, gt=0, description="Total Daily Energy Expenditure")
    calorie_goal: Optional[float] = Field(None, gt=0, description="Target daily calorie intake")
    
    # Notification preferences (S-10 Notifications)
    notification_enabled: bool = Field(default=False, description="Whether notifications are enabled")
    reminder_time: Optional[time] = Field(None, description="Time of day for the reminder")

# Schema for creating a new profile (e.g., POST request from S-11 Onboarding Complete)
class UserHealthProfileCreate(UserHealthProfileBase):
    user_id: UUID = Field(..., description="The user's UUID from the authentication system")

# Schema for updating an existing profile (e.g., PUT/PATCH request)
class UserHealthProfileUpdate(BaseModel):
    goal: Optional[HealthGoal] = None
    height_cm: Optional[float] = Field(None, gt=0)
    weight_kg: Optional[float] = Field(None, gt=0)
    age: Optional[int] = Field(None, gt=0)
    gender: Optional[GenderType] = None
    activity_level: Optional[ActivityLevel] = None
    tdee: Optional[float] = Field(None, gt=0)
    calorie_goal: Optional[float] = Field(None, gt=0)
    notification_enabled: Optional[bool] = None
    reminder_time: Optional[time] = None

# Schema for returning the profile from the database (includes DB-generated fields)
class UserHealthProfile(UserHealthProfileBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True # Allows mapping from ORM objects if using SQLAlchemy
