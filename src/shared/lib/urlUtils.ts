import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Validates whether a URL string is parseable.
 */
export const canParseUrl = (url: string, base?: string): boolean => {
  try {
    if (typeof URL.canParse === 'function') {
      return URL.canParse(url, base);
    }
    new URL(url, base);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Builds a standardized URL string from a baseUrl and path.
 */
export const buildApiUrl = (baseUrl: string, path: string): string => {
  const cleanBase = baseUrl.trim().replace(/\/+$/, '');
  const cleanPath = path.trim().startsWith('/') ? path.trim() : `/${path.trim()}`;
  return `${cleanBase}${cleanPath}`;
};

/**
 * Auto-detects the host IP address based on platform and Metro bundler.
 */
export const getAutoDetectedHost = (): string => {
  try {
    const hostUri =
      Constants.expoConfig?.hostUri ||
      (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ||
      (Constants.manifest as any)?.debuggerHost;

    if (hostUri) {
      const ip = hostUri.split(':')[0];
      if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
        return ip;
      }
    }
  } catch (_) {}

  if (Platform.OS === 'android') {
    return '10.0.2.2'; // Standard Android Emulator loopback alias
  }

  return 'localhost';
};

/**
 * Returns default API server baseUrl with the specified port.
 */
export const getDefaultBaseUrl = (port = 4021): string => {
  const host = getAutoDetectedHost();
  return `http://${host}:${port}`;
};
