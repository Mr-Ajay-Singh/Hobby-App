import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Standard WHATWG URL Parser & Validator
 * Supports URL construction, getters, base URLs, and canParse
 */
export const isValidUrl = (urlStr: string): boolean => {
  if (!urlStr || typeof urlStr !== 'string') return false;
  try {
    if (typeof URL.canParse === 'function') {
      return URL.canParse(urlStr);
    }
    new URL(urlStr);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Normalizes input URL with standard protocol and endpoint path
 * Handles cases like "192.168.1.5:4021", "localhost:4021", "http://10.0.2.2:4021/"
 */
export const buildApiUrl = (
  baseUrlOrHost: string,
  path: string = '/api/v1/ai/learn-skill'
): string => {
  let cleaned = (baseUrlOrHost || '').trim();

  // Prepend http:// if missing protocol
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `http://${cleaned}`;
  }

  // Remove trailing slash
  cleaned = cleaned.replace(/\/+$/, '');

  // Clean path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  try {
    const urlObj = new URL(normalizedPath, cleaned);
    return urlObj.toString();
  } catch (_) {
    return `${cleaned}${normalizedPath}`;
  }
};

/**
 * Automatically detects the developer host machine IP address
 * - On Android Emulator -> returns 10.0.2.2
 * - On Physical Android/iOS Device connected to Metro -> extracts LAN IP (e.g. 192.168.X.X)
 * - On iOS Simulator / Web -> returns localhost
 */
export const getAutoDetectedHost = (): string => {
  try {
    const hostUri =
      Constants.expoConfig?.hostUri ||
      (Constants as any).manifest?.debuggerHost ||
      (Constants as any).manifest2?.extra?.expoClient?.hostUri;

    if (hostUri && typeof hostUri === 'string') {
      const ip = hostUri.split(':')[0];
      if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
        return ip;
      }
    }
  } catch (_) {}

  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }

  return 'localhost';
};

/**
 * Returns the recommended default base URL for the active platform
 */
export const getDefaultBaseUrl = (port: number = 4021): string => {
  const host = getAutoDetectedHost();
  return `http://${host}:${port}`;
};
