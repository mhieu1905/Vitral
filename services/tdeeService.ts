import type { ActivityLevel, GenderType, HealthGoal } from '../types/healthProfile';
import type { NutritionTarget, TDEEInput } from '../types/tdee';

/**
 * TDEE & Calorie Goal Engine
 *
 * Pure, deterministic calculation service — no network calls, no side-effects.
 * Uses the Mifflin-St Jeor formula for BMR estimation.
 *
 * Usage:
 *   import { tdeeService } from '@/services/tdeeService';
 *   const targets = tdeeService.getDailyNutritionTarget(userProfile);
 */

// ─── Constants ──────────────────────────────────────────────────────────────────

/** Activity-level multipliers (Harris-Benedict convention). */
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary:         1.2,    // desk job, minimal movement
  lightly_active:    1.375,  // light exercise 1-3 days/week
  moderately_active: 1.55,   // moderate exercise 3-5 days/week
  very_active:       1.725,  // hard exercise 6-7 days/week
  extra_active:      1.9,    // very hard exercise, physical job
};

/**
 * Calorie adjustments per goal (kcal/day).
 * Positive = surplus, negative = deficit, zero = maintenance.
 */
const GOAL_CALORIE_ADJUSTMENTS: Record<HealthGoal, number> = {
  lose_weight:      -400,   // safe deficit (300–500 range, use midpoint)
  maintain_weight:     0,
  gain_weight:       300,   // moderate surplus
  build_muscle:      300,   // lean bulk surplus (200–400 range, use midpoint)
  improve_fitness:     0,   // maintenance — performance focus
};

/** Macro split ratios (must sum to 1.0). */
const MACRO_RATIOS = {
  protein: 0.25,  // 25 %
  carbs:   0.45,  // 45 %
  fat:     0.30,  // 30 %
} as const;

/** Calories per gram of each macronutrient. */
const KCAL_PER_GRAM = {
  protein: 4,
  carbs:   4,
  fat:     9,
} as const;

// ─── Core Functions ─────────────────────────────────────────────────────────────

/**
 * Calculate Basal Metabolic Rate using the **Mifflin-St Jeor** equation.
 *
 * Male  : BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age(y) + 5
 * Female: BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age(y) − 161
 *
 * For non-binary / prefer-not-to-say, we average the male and female results
 * to provide a reasonable midpoint estimate.
 */
function calculateBMR(user: Pick<TDEEInput, 'weight_kg' | 'height_cm' | 'age' | 'gender'>): number {
  const base = 10 * user.weight_kg + 6.25 * user.height_cm - 5 * user.age;

  switch (user.gender) {
    case 'male':
      return Math.round(base + 5);
    case 'female':
      return Math.round(base - 161);
    case 'other':
    case 'prefer_not_to_say':
    default:
      // Average of male & female formulas: (base + 5 + base - 161) / 2
      return Math.round(base - 78);
  }
}

/**
 * Calculate Total Daily Energy Expenditure.
 * TDEE = BMR × activity multiplier
 */
function calculateTDEE(user: Pick<TDEEInput, 'weight_kg' | 'height_cm' | 'age' | 'gender' | 'activity_level'>): number {
  const bmr = calculateBMR(user);
  const multiplier = ACTIVITY_MULTIPLIERS[user.activity_level] ?? ACTIVITY_MULTIPLIERS.sedentary;
  return Math.round(bmr * multiplier);
}

/**
 * Calculate the daily calorie goal adjusted for the user's health objective.
 */
function calculateCalorieGoal(user: TDEEInput): number {
  const tdee = calculateTDEE(user);
  const adjustment = GOAL_CALORIE_ADJUSTMENTS[user.goal] ?? 0;
  // Never go below 1200 kcal — widely accepted safe minimum
  return Math.max(1200, Math.round(tdee + adjustment));
}

/**
 * Calculate the full daily nutrition target: BMR, TDEE, calorie goal & macros.
 *
 * This is the primary entry point for consumers (dashboard, nutrition tracker,
 * recommendation engine, etc.).
 */
function getDailyNutritionTarget(user: TDEEInput): NutritionTarget {
  const bmr          = calculateBMR(user);
  const tdee         = calculateTDEE(user);
  const calorie_goal = calculateCalorieGoal(user);

  return {
    bmr,
    tdee,
    calorie_goal,
    protein_target: Math.round((calorie_goal * MACRO_RATIOS.protein) / KCAL_PER_GRAM.protein),
    carbs_target:   Math.round((calorie_goal * MACRO_RATIOS.carbs)   / KCAL_PER_GRAM.carbs),
    fat_target:     Math.round((calorie_goal * MACRO_RATIOS.fat)     / KCAL_PER_GRAM.fat),
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────────

export const tdeeService = {
  calculateBMR,
  calculateTDEE,
  calculateCalorieGoal,
  getDailyNutritionTarget,

  /** Exposed for advanced consumers (e.g. custom macro splits). */
  ACTIVITY_MULTIPLIERS,
  GOAL_CALORIE_ADJUSTMENTS,
  MACRO_RATIOS,
  KCAL_PER_GRAM,
} as const;
