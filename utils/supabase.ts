import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { Platform } from 'react-native'

const ExpoStorage = {
  getItem: (key: string) => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') {
        return Promise.resolve(null);
      }
      if (window.localStorage) {
        return Promise.resolve(window.localStorage.getItem(key));
      }
    }
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') {
        return Promise.resolve();
      }
      if (window.localStorage) {
        window.localStorage.setItem(key, value);
        return Promise.resolve();
      }
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') {
        return Promise.resolve();
      }
      if (window.localStorage) {
        window.localStorage.removeItem(key);
        return Promise.resolve();
      }
    }
    return AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!,
  {
    auth: {
      storage: ExpoStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })