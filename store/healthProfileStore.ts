import { create } from 'zustand';
import { healthProfileService } from '../services/healthProfileService';
import {
  HealthProfile,
  HealthProfileUpdatePayload,
  WeightRecord,
} from '../types/healthProfile';

interface HealthProfileState {
  // Data
  profile: HealthProfile | null;
  weightHistory: WeightRecord[];

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, data: HealthProfileUpdatePayload) => Promise<void>;
  fetchWeightHistory: (userId: string) => Promise<void>;
  addWeight: (userId: string, weight: number) => Promise<void>;
  clearProfile: () => void;
  clearError: () => void;
}

export const useHealthProfileStore = create<HealthProfileState>((set, get) => ({
  profile: null,
  weightHistory: [],
  isLoading: false,
  error: null,

  fetchProfile: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await healthProfileService.getUserHealthProfile(userId);
      set({ profile, isLoading: false });
    } catch (error: any) {
      console.error('[HealthProfileStore] fetchProfile error:', error);
      set({ error: error.message || 'Failed to load profile', isLoading: false });
    }
  },

  updateProfile: async (userId: string, data: HealthProfileUpdatePayload) => {
    set({ isLoading: true, error: null });
    try {
      // Check if weight changed — if so, also add to weight history
      const currentProfile = get().profile;
      const weightChanged = data.weight_kg && currentProfile && data.weight_kg !== currentProfile.weight_kg;

      const updatedProfile = await healthProfileService.updateUserHealthProfile(userId, data);
      set({ profile: updatedProfile, isLoading: false });

      // Track weight change in history
      if (weightChanged && data.weight_kg) {
        try {
          await healthProfileService.addWeightHistory(userId, data.weight_kg);
          // Refresh weight history
          const weightHistory = await healthProfileService.getWeightHistory(userId);
          set({ weightHistory });
        } catch (weightError) {
          console.error('[HealthProfileStore] Weight history update error:', weightError);
          // Don't fail the profile update if weight history fails
        }
      }
    } catch (error: any) {
      console.error('[HealthProfileStore] updateProfile error:', error);
      set({ error: error.message || 'Failed to update profile', isLoading: false });
      throw error; // Re-throw so UI can handle it
    }
  },

  fetchWeightHistory: async (userId: string) => {
    try {
      const weightHistory = await healthProfileService.getWeightHistory(userId);
      set({ weightHistory });
    } catch (error: any) {
      console.error('[HealthProfileStore] fetchWeightHistory error:', error);
      // Don't set error — weight history is secondary data
    }
  },

  addWeight: async (userId: string, weight: number) => {
    try {
      await healthProfileService.addWeightHistory(userId, weight);
      const weightHistory = await healthProfileService.getWeightHistory(userId);
      set({ weightHistory });
    } catch (error: any) {
      console.error('[HealthProfileStore] addWeight error:', error);
      set({ error: error.message || 'Failed to add weight record' });
    }
  },

  clearProfile: () => {
    set({ profile: null, weightHistory: [], isLoading: false, error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
