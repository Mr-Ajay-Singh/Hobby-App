import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = 'INV_ANONYMOUS_DEVICE_ID';

let cachedDeviceId: string | null = null;

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Gets or creates a persistent device UUID.
 * Persists in AsyncStorage until app uninstall or data clear.
 */
export async function getDeviceId(): Promise<string> {
  if (cachedDeviceId) return cachedDeviceId;

  try {
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = generateUUID();
      await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    cachedDeviceId = deviceId;
    return deviceId;
  } catch (err) {
    if (!cachedDeviceId) {
      cachedDeviceId = generateUUID();
    }
    return cachedDeviceId;
  }
}
