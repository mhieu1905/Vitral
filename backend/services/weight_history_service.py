from typing import Any, List, Optional
from uuid import UUID

from models.weight_history import WeightHistoryCreate, WeightHistoryRecord


class WeightHistoryService:
    """
    Service to handle weight history tracking for users.
    Currently reuses the 'user_health_profiles' table to avoid creating a new table.
    """

    def __init__(self, db: Any):
        self.db = db
        self.table_name = "user_health_profiles"

    def add_weight_record(self, data: WeightHistoryCreate) -> WeightHistoryRecord:
        """
        Update the current weight in user_health_profiles.
        """
        print(f"[backend] Updating weight for user_id={data.user_id}, weight_kg={data.weight}")
        response = (
            self.db.table(self.table_name)
            .update({"weight_kg": data.weight})
            .eq("user_id", str(data.user_id))
            .execute()
        )

        if not response.data:
            raise Exception("Failed to update weight in user profile.")

        record = response.data[0]
        return WeightHistoryRecord(
            id=record["id"],
            user_id=record["user_id"],
            weight=record["weight_kg"],
            recorded_at=record["updated_at"]
        )

    def get_weight_history(self, user_id: UUID, limit: int = 30) -> List[WeightHistoryRecord]:
        """
        Retrieve the weight record from user_health_profiles.
        Returns a list with a single record (the current weight) to satisfy the frontend API.
        """
        response = (
            self.db.table(self.table_name)
            .select("id, user_id, weight_kg, updated_at")
            .eq("user_id", str(user_id))
            .execute()
        )

        if not response.data:
            return []

        return [
            WeightHistoryRecord(
                id=record["id"],
                user_id=record["user_id"],
                weight=record["weight_kg"],
                recorded_at=record["updated_at"]
            )
            for record in response.data
        ]

    def get_latest_weight(self, user_id: UUID) -> Optional[float]:
        """
        Get the weight from user_health_profiles.
        """
        response = (
            self.db.table(self.table_name)
            .select("weight_kg")
            .eq("user_id", str(user_id))
            .execute()
        )

        if not response.data:
            return None

        return response.data[0].get("weight_kg")
