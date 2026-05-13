import { create } from "zustand";

type Gender = "male" | "female" | null;

type OnboardingState = {
  age: number | null;
  gender: Gender;
  goal: string | null;
  weight: number | null;

  setAge: (age: number) => void;
  setGender: (gender: Gender) => void;
  setGoal: (goal: string) => void;
  setWeight: (weight: number) => void;

  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  age: null,
  gender: null,
  goal: null,
  weight: null,

  setAge: (age) => set({ age }),
  setGender: (gender) => set({ gender }),
  setGoal: (goal) => set({ goal }),
  setWeight: (weight) => set({ weight }),

  reset: () =>
    set({
      age: null,
      gender: null,
      goal: null,
      weight: null,
    }),
}));