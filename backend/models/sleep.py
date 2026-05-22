from pydantic import BaseModel, Field
from typing import Optional, List


class SleepUpsertCreate(BaseModel):
    log_date: str = Field(..., description="Local date in YYYY-MM-DD")
    start_time: str = Field(..., description="Local time HH:MM")
    end_time: str = Field(..., description="Local time HH:MM")
    awake_minutes: int = Field(0, ge=0, le=600)
    quality_user: Optional[int] = Field(None, ge=1, le=5)
    notes: Optional[str] = None


class SleepArchitecture(BaseModel):
    awake_min: int
    rem_min: int
    light_min: int
    deep_min: int


class SleepTodayResponse(BaseModel):
    log_date: str
    score: int
    status_text: str
    total_duration_min: int
    wake_time: str
    architecture: SleepArchitecture
    insight_title: str
    insight_description: str


class SleepHistoryDay(BaseModel):
    log_date: str
    score: int
    total_duration_min: int
    architecture: SleepArchitecture


class SleepHistoryResponse(BaseModel):
    days: List[SleepHistoryDay]
