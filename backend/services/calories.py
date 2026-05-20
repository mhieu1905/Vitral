def calculate_calories(activity_type: str, duration: int, intensity: str) -> float:
    met_values = {
        "Running": 9.0,
        "Cycling": 7.5,
        "Swimming": 8.0,
        "Walking": 3.5,
        "Gym": 6.0,
        "Yoga": 3.0,
        "Football": 8.0,
        "Basketball": 7.0,
    }

    intensity_multiplier = {
        "low": 0.8,
        "medium": 1.0,
        "high": 1.3,
    }

    base_rate = met_values.get(activity_type.title(), 5.0)
    multiplier = intensity_multiplier.get(intensity, 1.0)

    calories = base_rate * multiplier * 70 * (duration / 60)
    return round(calories, 2)