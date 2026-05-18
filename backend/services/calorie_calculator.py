from typing import Union

class CalorieCalculatorService:
    """
    Service for calculating Basal Metabolic Rate (BMR), 
    Total Daily Energy Expenditure (TDEE), and daily calorie goals.
    Uses the Mifflin-St Jeor Equation.
    """

    # Activity multipliers
    ACTIVITY_MULTIPLIERS = {
        "sedentary": 1.2,
        "lightly_active": 1.375,
        "moderately_active": 1.55,
        "very_active": 1.725,
        "extra_active": 1.9
    }

    @staticmethod
    def calculate_bmr(weight_kg: float, height_cm: float, age: int, gender: str) -> float:
        """
        Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation.
        
        Args:
            weight_kg (float): Weight in kilograms
            height_cm (float): Height in centimeters
            age (int): Age in years
            gender (str): Gender ('male', 'female', 'other', 'prefer_not_to_say')
            
        Returns:
            float: BMR value in calories
        """
        if weight_kg <= 0 or height_cm <= 0 or age <= 0:
            raise ValueError("Weight, height, and age must be strictly positive values.")

        # Base calculation
        bmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age)

        # Gender adjustment
        gender_lower = gender.lower()
        if gender_lower == "male":
            bmr += 5
        elif gender_lower == "female":
            bmr -= 161
        else:
            # For 'other' or 'prefer_not_to_say', use an average of male and female adjustments
            # Average of +5 and -161 is -78
            bmr -= 78

        return bmr

    @staticmethod
    def calculate_tdee(bmr: float, activity_level: str) -> float:
        """
        Calculate Total Daily Energy Expenditure (TDEE).
        
        Args:
            bmr (float): Basal Metabolic Rate
            activity_level (str): Level of daily activity
            
        Returns:
            float: TDEE value in calories
        """
        if bmr <= 0:
            raise ValueError("BMR must be a positive value.")

        multiplier = CalorieCalculatorService.ACTIVITY_MULTIPLIERS.get(activity_level)
        if multiplier is None:
            raise ValueError(f"Invalid activity level. Must be one of {list(CalorieCalculatorService.ACTIVITY_MULTIPLIERS.keys())}")

        return bmr * multiplier

    @staticmethod
    def calculate_calorie_goal(tdee: float, goal: str) -> float:
        """
        Calculate target daily calorie intake based on TDEE and user's goal.
        
        Args:
            tdee (float): Total Daily Energy Expenditure
            goal (str): User's health goal
            
        Returns:
            float: Target daily calories
        """
        if tdee <= 0:
            raise ValueError("TDEE must be a positive value.")

        goal_lower = goal.lower()
        
        # Adjust calories based on goal
        if goal_lower == "lose_weight":
            return tdee - 400
        elif goal_lower == "build_muscle":
            return tdee + 300
        elif goal_lower == "gain_weight":
            return tdee + 500
        elif goal_lower == "improve_fitness":
            return tdee - 150
        elif goal_lower in ["maintain_weight", "stay_fit", "mental_wellness", "maintain"]:
            return tdee
        else:
            # Default to maintaining weight for unrecognized goals
            return tdee

    @classmethod
    def process_health_metrics(cls, weight_kg: float, height_cm: float, age: int, 
                               gender: str, activity_level: str, goal: str) -> dict[str, float]:
        """
        Convenience method to calculate all metrics at once.
        
        Returns:
            dict: Containing bmr, tdee, and calorie_goal
        """
        bmr = cls.calculate_bmr(weight_kg, height_cm, age, gender)
        tdee = cls.calculate_tdee(bmr, activity_level)
        calorie_goal = cls.calculate_calorie_goal(tdee, goal)
        
        return {
            "bmr": round(bmr, 2),
            "tdee": round(tdee, 2),
            "calorie_goal": round(calorie_goal, 2)
        }
