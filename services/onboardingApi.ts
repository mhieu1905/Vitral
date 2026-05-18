import { API_BASE_URL } from '../constants/api';

export interface HealthProfilePayload {
  user_id: string;
  goal: string;
  height_cm: number;
  weight_kg: number;
  age: number;
  gender: string;
  activity_level: string;
  notification_enabled: boolean;
  reminder_time: string | null;
}

export const onboardingApi = {
  async getProfile(userId: string) {
    const url = `${API_BASE_URL}/onboarding/profile/${userId}`;
    console.log('[API] GET Profile:', url);
    try {
      const response = await fetch(url);
      console.log('[API] GET Profile Response Status:', response.status);
      if (!response.ok) {
        if (response.status === 404) {
          return null; // Profile doesn't exist
        }
        throw new Error('Failed to fetch health profile');
      }
      return response.json();
    } catch (error) {
      console.error('[API] GET Profile Error:', error);
      throw error;
    }
  },

  async createProfile(data: HealthProfilePayload) {
    const url = `${API_BASE_URL}/onboarding/profile`;
    console.log('[API] POST Profile:', url, 'Data:', data);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log('[API] POST Profile Response Status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[API] POST Profile Error Data:', errorData);
        throw new Error(errorData.detail || 'Failed to create health profile');
      }
      return response.json();
    } catch (error) {
      console.error('[API] POST Profile Fetch Error:', error);
      throw error;
    }
  },

  async updateProfile(userId: string, data: Partial<HealthProfilePayload>) {
    const url = `${API_BASE_URL}/onboarding/profile/${userId}`;
    console.log('[API] PUT Profile:', url, 'Data:', data);
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('[API] PUT Profile Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[API] PUT Profile Error Data:', errorData);
        throw new Error(errorData.detail || 'Failed to update health profile');
      }
      return response.json();
    } catch (error) {
      console.error('[API] PUT Profile Fetch Error:', error);
      throw error;
    }
  }
};
