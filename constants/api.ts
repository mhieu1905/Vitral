import { Platform } from 'react-native';

const getApiBaseUrl = () => {
  // 1. Use environment variable if provided
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Android emulator: always use 10.0.2.2 (loopback alias to host machine)
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }

  // 3. Default to localhost (works for iOS simulator and local web)
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();
