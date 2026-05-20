from pydantic import BaseModel
from typing import List, Optional

class RecommendationItem(BaseModel):
    category: str        # 'breathing' | 'meditation' | 'journal' | 'lifestyle'
    title: str
    description: str
    action_route: Optional[str] = None
    priority: int = 0
    reason: str

class RecommendationResponse(BaseModel):
    recommendations: List[RecommendationItem]
    summary: str         # "You've been stressed 3 days in a row..."
    stress_avg: float
    mood_score: float    # 0-4 scale
    journal_streak: int  # số ngày liên tiếp có journal