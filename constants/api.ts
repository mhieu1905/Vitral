import Constants from 'expo-constants';
import { Platform } from 'react-native';

const normalizeBaseUrl = (value: string) => value.replace(/\/$/, '');

const getDevServerHost = (): string | null => {
  // Expo SDKs expose the dev server host in slightly different places.
  // Common shapes:
  // - Constants.expoConfig.hostUri            -> "192.168.1.10:8081"
  // - Constants.manifest.debuggerHost        -> "192.168.1.10:8081"
  // - Constants.manifest2.extra.expoClient.hostUri
  const anyConstants = Constants as unknown as {
    expoConfig?: { hostUri?: string };
    manifest?: { debuggerHost?: string };
    manifest2?: { extra?: { expoClient?: { hostUri?: string } } };
  };

  const hostUri =
    anyConstants.expoConfig?.hostUri ||
    anyConstants.manifest2?.extra?.expoClient?.hostUri ||
    anyConstants.manifest?.debuggerHost;

  if (!hostUri) return null;
  return hostUri.split(':')[0] ?? null;
};

const getApiBaseUrl = () => {
  // 1. Use environment variable if provided
  if (process.env.EXPO_PUBLIC_API_URL) {
    return normalizeBaseUrl(process.env.EXPO_PUBLIC_API_URL);
  }

  // 2. In development, prefer using the machine IP running Metro.
  // This works for physical devices on the same LAN and also works for simulators.
  const devHost = getDevServerHost();
  if (devHost) {
    return `http://${devHost}:8000`;
  }

  // 3. Android emulator fallback: 10.0.2.2 (loopback alias to host machine)
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }

  // 4. Default to localhost (works for iOS simulator and local web)
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();
