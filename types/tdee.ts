import type { ActivityLevel, GenderType, HealthGoal } from './healthProfile';

// ─── Input ──────────────────────────────────────────────────────────────────────

/**
 * Minimal profile fields required by the TDEE calculation engine.
 * This is a subset of HealthProfile — any object that satisfies this shape works.
 */
export interface TDEEInput {
  age: number;
  gender: GenderType;
  height_cm: number;
  weight_kg: number;
  activity_level: ActivityLevel;
  goal: HealthGoal;
}

// ─── Output ─────────────────────────────────────────────────────────────────────

/** Result of a full TDEE + macro calculation. */
export interface NutritionTarget {
  /** Basal Metabolic Rate (kcal/day) */
  bmr: number;
  /** Total Daily Energy Expenditure (kcal/day) */
  tdee: number;
  /** Adjusted daily calorie goal based on user's goal (kcal/day) */
  calorie_goal: number;
  /** Protein target (grams/day) — 25 % of calorie_goal */
  protein_target: number;
  /** Carbohydrate target (grams/day) — 45 % of calorie_goal */
  carbs_target: number;
  /** Fat target (grams/day) — 30 % of calorie_goal */
  fat_target: number;
}
