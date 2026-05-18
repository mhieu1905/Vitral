from typing import Dict, Any
from uuid import UUID

from ..models.user_health_profile import UserHealthProfileCreate, UserHealthProfileUpdate, UserHealthProfile
from .calorie_calculator import CalorieCalculatorService

class OnboardingService:
    """
    Service to handle business logic for user onboarding and health goals.
    """
    
    def __init__(self, db: Any):
        self.db = db
        self.table_name = "user_health_profiles"

    def create_user_profile(self, profile_data: UserHealthProfileCreate) -> UserHealthProfile:
        """
        Creates a new user health profile.
        Calculates TDEE and calorie goal before saving.
        """
        # Calculate health metrics
        metrics = CalorieCalculatorService.process_health_metrics(
            weight_kg=profile_data.weight_kg,
            height_cm=profile_data.height_cm,
            age=profile_data.age,
            gender=profile_data.gender.value,
            activity_level=profile_data.activity_level.value,
            goal=profile_data.goal.value
        )
        
        # Prepare data for insertion
        insert_data = profile_data.dict()
        insert_data["user_id"] = str(insert_data["user_id"]) # Supabase requires UUIDs as strings
        
        # We store enums as strings in the DB
        insert_data["goal"] = insert_data["goal"].value
        insert_data["gender"] = insert_data["gender"].value
        insert_data["activity_level"] = insert_data["activity_level"].value
        
        if insert_data.get("reminder_time"):
            insert_data["reminder_time"] = insert_data["reminder_time"].strftime("%H:%M:%S")

        # Merge calculated metrics
        insert_data.update({
            "tdee": metrics["tdee"],
            "calorie_goal": metrics["calorie_goal"]
        })

        # Upsert into Supabase to avoid conflict when the same user profile already exists.
        print(f"[backend] Upserting profile for user_id={insert_data['user_id']}")
        response = self.db.table(self.table_name).upsert(insert_data, on_conflict="user_id").execute()
        print(f"[backend] Upsert response data length={len(response.data) if response.data is not None else 0}")
        
        if not response.data:
            raise Exception("Failed to create user health profile in database.")
            
        return UserHealthProfile(**response.data[0])

    def get_user_profile(self, user_id: UUID) -> UserHealthProfile:
        """
        Retrieves a user's health profile by their user_id.
        """
        response = self.db.table(self.table_name).select("*").eq("user_id", str(user_id)).execute()
        
        if not response.data:
            raise ValueError(f"No profile found for user_id {user_id}")
            
        return UserHealthProfile(**response.data[0])

    def update_user_profile(self, user_id: UUID, profile_data: UserHealthProfileUpdate) -> UserHealthProfile:
        """
        Updates an existing user health profile.
        Recalculates TDEE and calorie goal if relevant fields change.
        """
        # First, fetch the existing profile to calculate the new metrics if necessary
        existing_profile = self.get_user_profile(user_id)
        
        update_dict = profile_data.dict(exclude_unset=True)
        
        # If we need to recalculate metrics
        if any(key in update_dict for key in ["weight_kg", "height_cm", "age", "gender", "activity_level", "goal"]):
            weight = update_dict.get("weight_kg", existing_profile.weight_kg)
            height = update_dict.get("height_cm", existing_profile.height_cm)
            age = update_dict.get("age", existing_profile.age)
            
            gender_val = update_dict.get("gender", existing_profile.gender)
            if hasattr(gender_val, 'value'):
                gender_val = gender_val.value
                
            activity_val = update_dict.get("activity_level", existing_profile.activity_level)
            if hasattr(activity_val, 'value'):
                activity_val = activity_val.value
                
            goal_val = update_dict.get("goal", existing_profile.goal)
            if hasattr(goal_val, 'value'):
                goal_val = goal_val.value

            metrics = CalorieCalculatorService.process_health_metrics(
                weight_kg=weight,
                height_cm=height,
                age=age,
                gender=gender_val,
                activity_level=activity_val,
                goal=goal_val
            )
            update_dict["tdee"] = metrics["tdee"]
            update_dict["calorie_goal"] = metrics["calorie_goal"]

        # Convert enums to strings for Supabase update
        for key in ["goal", "gender", "activity_level"]:
            if key in update_dict and hasattr(update_dict[key], 'value'):
                update_dict[key] = update_dict[key].value
                
        if "reminder_time" in update_dict and update_dict["reminder_time"] is not None:
            update_dict["reminder_time"] = update_dict["reminder_time"].strftime("%H:%M:%S")

        response = self.db.table(self.table_name).update(update_dict).eq("user_id", str(user_id)).execute()
        
        if not response.data:
            raise Exception("Failed to update user health profile.")
            
        return UserHealthProfile(**response.data[0])
