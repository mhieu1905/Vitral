import { ActivityLevel, GenderType, HealthGoal } from '../types/healthProfile';

/**
 * Frontend TDEE calculator using Mifflin-St Jeor Equation.
 * Mirrors the backend CalorieCalculatorService for instant UI previews.
 */

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation.
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: GenderType
): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 0;

  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;

  switch (gender) {
    case 'male':
      bmr += 5;
      break;
    case 'female':
      bmr -= 161;
      break;
    default:
      // Average of male (+5) and female (-161) for 'other' / 'prefer_not_to_say'
      bmr -= 78;
      break;
  }

  return Math.round(bmr * 100) / 100;
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE).
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  if (bmr <= 0) return 0;
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.2;
  return Math.round(bmr * multiplier * 100) / 100;
}

/**
 * Calculate target daily calorie intake based on TDEE and user's goal.
 */
export function calculateCalorieGoal(tdee: number, goal: HealthGoal): number {
  if (tdee <= 0) return 0;

  switch (goal) {
    case 'lose_weight':
      return tdee - 400;
    case 'build_muscle':
      return tdee + 300;
    case 'gain_weight':
      return tdee + 500;
    case 'improve_fitness':
      return tdee - 150;
    case 'maintain_weight':
    default:
      return tdee;
  }
}

/**
 * Convenience function to calculate all metrics at once.
 */
export function calculateAllMetrics(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: GenderType,
  activityLevel: ActivityLevel,
  goal: HealthGoal
) {
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const calorieGoal = calculateCalorieGoal(tdee, goal);

  return { bmr, tdee, calorieGoal };
}
