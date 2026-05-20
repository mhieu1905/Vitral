// ─── Enums ─────────────────────────────────────────────────────────────────────

export type HealthGoal =
  | 'lose_weight'
  | 'maintain_weight'
  | 'gain_weight'
  | 'build_muscle'
  | 'improve_fitness';

export type GenderType = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active';

// ─── Health Profile ────────────────────────────────────────────────────────────

export interface HealthProfile {
  id: string;
  user_id: string;
  goal: HealthGoal;
  height_cm: number;
  weight_kg: number;
  age: number;
  gender: GenderType;
  activity_level: ActivityLevel;
  tdee: number | null;
  calorie_goal: number | null;
  notification_enabled: boolean;
  reminder_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface HealthProfilePayload {
  user_id: string;
  goal: HealthGoal;
  height_cm: number;
  weight_kg: number;
  age: number;
  gender: GenderType;
  activity_level: ActivityLevel;
  notification_enabled?: boolean;
  reminder_time?: string | null;
}

export interface HealthProfileUpdatePayload {
  goal?: HealthGoal;
  height_cm?: number;
  weight_kg?: number;
  age?: number;
  gender?: GenderType;
  activity_level?: ActivityLevel;
  notification_enabled?: boolean;
  reminder_time?: string | null;
}

// ─── Weight History ────────────────────────────────────────────────────────────

export interface WeightRecord {
  id: string;
  user_id: string;
  weight: number;
  recorded_at: string;
}

// ─── Display Helpers ───────────────────────────────────────────────────────────

export const GOAL_LABELS: Record<HealthGoal, string> = {
  lose_weight: 'Lose Weight',
  maintain_weight: 'Maintain Weight',
  gain_weight: 'Gain Weight',
  build_muscle: 'Build Muscle',
  improve_fitness: 'Improve Fitness',
};

export const GOAL_ICONS: Record<HealthGoal, string> = {
  lose_weight: '✕',
  maintain_weight: '≋',
  gain_weight: '☽',
  build_muscle: '🏋',
  improve_fitness: '⊙',
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary',
  lightly_active: 'Lightly Active',
  moderately_active: 'Moderately Active',
  very_active: 'Very Active',
  extra_active: 'Extra Active',
};

export const ACTIVITY_DESCRIPTIONS: Record<ActivityLevel, string> = {
  sedentary: 'Desk job, minimal movement',
  lightly_active: 'Occasional walking, light tasks',
  moderately_active: 'Exercise 3–5 days a week',
  very_active: 'Daily intense physical sport',
  extra_active: 'Very intense daily exercise',
};

export const GENDER_LABELS: Record<GenderType, string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
  prefer_not_to_say: 'Prefer not to say',
};
