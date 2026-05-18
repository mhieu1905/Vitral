import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getApiBaseUrl = () => {
  // 1. Use environment variable if provided
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. In development, dynamically determine the local IP
  if (__DEV__) {
    // Try to extract the IP from the Expo manifest (useful for physical devices)
    const hostUri = Constants.expoConfig?.hostUri || 
                   // @ts-ignore - internal property
                   Constants.manifest2?.extra?.expoGo?.debuggerHost || 
                   // @ts-ignore - internal property
                   Constants.manifest?.debuggerHost;
    
    if (hostUri) {
      // hostUri is usually something like "192.168.1.100:8081"
      const ipAddress = hostUri.split(':')[0];
      return `http://${ipAddress}:8000`;
    }

    // 3. Fallback for emulators if hostUri is not available
    if (Platform.OS === 'android') {
      // 10.0.2.2 is the alias to the host loopback interface in Android emulator
      return 'http://10.0.2.2:8000';
    }
  }

  // Default to localhost (works for iOS simulator and local web)
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();
