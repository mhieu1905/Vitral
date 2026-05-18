import { create } from "zustand";

type Gender = "male" | "female" | "other" | "prefer_not_to_say" | null;
type ActivityLevel = "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extra_active" | null;

type OnboardingState = {
  isProfileExists: boolean;
  age: number | null;
  gender: Gender;
  goal: string | null;
  weight: number | null;
  height: number | null;
  activityLevel: ActivityLevel;
  notificationEnabled: boolean;
  reminderTime: string | null;

  setIsProfileExists: (exists: boolean) => void;
  setAge: (age: number) => void;
  setGender: (gender: Gender) => void;
  setGoal: (goal: string) => void;
  setWeight: (weight: number) => void;
  setHeight: (height: number) => void;
  setActivityLevel: (level: ActivityLevel) => void;
  setNotificationEnabled: (enabled: boolean) => void;
  setReminderTime: (time: string | null) => void;

  setAll: (data: Partial<OnboardingState>) => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  isProfileExists: false,
  age: null,
  gender: null,
  goal: null,
  weight: null,
  height: null,
  activityLevel: null,
  notificationEnabled: true,
  reminderTime: null,

  setIsProfileExists: (exists) => set({ isProfileExists: exists }),
  setAge: (age) => set({ age }),
  setGender: (gender) => set({ gender }),
  setGoal: (goal) => set({ goal }),
  setWeight: (weight) => set({ weight }),
  setHeight: (height) => set({ height }),
  setActivityLevel: (activityLevel) => set({ activityLevel }),
  setNotificationEnabled: (notificationEnabled) => set({ notificationEnabled }),
  setReminderTime: (reminderTime) => set({ reminderTime }),

  setAll: (data) => set((state) => ({ ...state, ...data })),

  reset: () =>
    set({
      isProfileExists: false,
      age: null,
      gender: null,
      goal: null,
      weight: null,
      height: null,
      activityLevel: null,
      notificationEnabled: true,
      reminderTime: null,
    }),
}));