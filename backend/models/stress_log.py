from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

class StressLogCreate(BaseModel):
    stress_level: int = Field(..., ge=1, le=10)
    note: Optional[str] = ""
    triggers: Optional[List[str]] = []

class StressLogResponse(BaseModel):
    id: str
    user_id: str
    stress_level: int
    note: str
    triggers: List[str]
    logged_at: datetime
    created_at: datetime

class StressTrend(BaseModel):
    date: str          # "2025-01-14"
    avg_level: float
    count: int

class StressStats(BaseModel):
    avg_7days: float
    avg_30days: float
    highest: int
    lowest: int
    total_logs: int
    trend: List[StressTrend]   # 7 ngày gần nhất