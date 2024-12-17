import 'react-native-get-random-values';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = 'device-id';

export async function getDeviceId(): Promise<string> {
  try {
    const storedDeviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
    if (storedDeviceId) {
      return storedDeviceId;
    }

    const newDeviceId = uuidv4();
    await SecureStore.setItemAsync(DEVICE_ID_KEY, newDeviceId);

    return newDeviceId;
  } catch (error) {
    console.error('Error retrieving device ID:', error);
    throw new Error('Unable to retrieve device ID');
  }
}
