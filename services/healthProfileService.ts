import { API_BASE_URL } from '../constants/api';
import {
  HealthProfile,
  HealthProfilePayload,
  HealthProfileUpdatePayload,
  WeightRecord,
} from '../types/healthProfile';

const fetchWithTimeout = async (
  url: string,
  options: RequestInit | undefined,
  timeoutMs: number
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...(options ?? {}),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Unified Health Profile API service.
 * Wraps FastAPI backend endpoints for profile and weight history management.
 */
export const healthProfileService = {
  // ─── Profile Operations ────────────────────────────────────────────────────

  /**
   * Fetch user health profile by user_id.
   * Returns null if profile doesn't exist (404).
   */
  async getUserHealthProfile(userId: string): Promise<HealthProfile | null> {
    const url = `${API_BASE_URL}/onboarding/profile/${userId}`;
    console.log('[HealthProfile] GET:', url);
    try {
      const response = await fetchWithTimeout(url, undefined, 8000);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch health profile: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('[HealthProfile] GET Error:', error);
      throw error;
    }
  },

  /**
   * Create or update (upsert) a user health profile.
   * The backend uses upsert on user_id to prevent duplicates.
   */
  async upsertUserHealthProfile(data: HealthProfilePayload): Promise<HealthProfile> {
    const url = `${API_BASE_URL}/onboarding/profile`;
    console.log('[HealthProfile] POST (upsert):', url);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to upsert health profile');
      }
      return response.json();
    } catch (error) {
      console.error('[HealthProfile] POST Error:', error);
      throw error;
    }
  },

  /**
   * Update specific fields of a user's health profile.
   * Backend recalculates TDEE/calorie_goal if relevant fields change.
   */
  async updateUserHealthProfile(
    userId: string,
    data: HealthProfileUpdatePayload
  ): Promise<HealthProfile> {
    const url = `${API_BASE_URL}/onboarding/profile/${userId}`;
    console.log('[HealthProfile] PUT:', url, 'Data:', data);
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to update health profile');
      }
      return response.json();
    } catch (error) {
      console.error('[HealthProfile] PUT Error:', error);
      throw error;
    }
  },

  // ─── Weight History Operations ─────────────────────────────────────────────

  /**
   * Add a new weight record for the user.
   */
  async addWeightHistory(userId: string, weight: number): Promise<WeightRecord> {
    const url = `${API_BASE_URL}/health/weight-history`;
    console.log('[HealthProfile] POST weight:', url);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, weight }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to add weight record');
      }
      return response.json();
    } catch (error) {
      console.error('[HealthProfile] POST weight Error:', error);
      throw error;
    }
  },

  /**
   * Get weight history for a user, ordered by most recent first.
   */
  async getWeightHistory(userId: string, limit: number = 30): Promise<WeightRecord[]> {
    const url = `${API_BASE_URL}/health/weight-history/${userId}?limit=${limit}`;
    console.log('[HealthProfile] GET weight history:', url);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch weight history: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('[HealthProfile] GET weight history Error:', error);
      return [];
    }
  },

  /**
   * Get the latest weight record for a user.
   */
  async getLatestWeight(userId: string): Promise<number | null> {
    const url = `${API_BASE_URL}/health/weight-history/${userId}/latest`;
    console.log('[HealthProfile] GET latest weight:', url);
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      const data = await response.json();
      return data.weight ?? null;
    } catch (error) {
      console.error('[HealthProfile] GET latest weight Error:', error);
      return null;
    }
  },
};
