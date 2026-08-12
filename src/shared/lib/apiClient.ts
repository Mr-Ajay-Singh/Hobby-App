import axios, { AxiosInstance } from 'axios';
import { Platform } from 'react-native';
import { getAutoDetectedHost } from './urlUtils';

export const createApiClient = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 25000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  instance.interceptors.request.use(async (config) => {
    try {
      const { getDeviceId } = require('./deviceId');
      const deviceId = await getDeviceId();
      if (deviceId) {
        config.headers['x-device-id'] = deviceId;
      }
    } catch (_) {}
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new Error('Request timed out after 25s. Server took too long to respond.'));
      }

      const isAndroid = Platform.OS === 'android';
      const isLocalhost =
        baseURL.includes('localhost') || baseURL.includes('127.0.0.1');

      if (isAndroid && isLocalhost && !error.response) {
        const detectedHost = getAutoDetectedHost();
        return Promise.reject(
          new Error(
            `Android cannot connect to 'localhost' directly.\n\n💡 Solution: Tap ⚙️ Settings and set Server URL to:\n• 'http://10.0.2.2:4021' (Android Emulator)\n• 'http://${detectedHost}:4021' (Physical Device via Wi-Fi)`
          )
        );
      }

      const backendMessage =
        error.response?.data?.data?.info ||
        error.response?.data?.info ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Network error occurred.';

      return Promise.reject(new Error(backendMessage));
    }
  );

  return instance;
};
