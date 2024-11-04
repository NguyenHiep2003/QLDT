import { TProfile } from '@/types/profile';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveProfileLocal(data: TProfile) {
    try {
        return await AsyncStorage.setItem('profile', JSON.stringify(data));
    } catch (error) {
        console.log('🚀 ~ saveProfileLocal ~ error:', error);
        throw error;
    }
}

export async function getProfileLocal(): Promise<TProfile | undefined> {
    try {
        const profile = await AsyncStorage.getItem('profile') as string;
        return JSON.parse(profile);
    } catch (error) {
        console.log('🚀 ~ getProfileLocal ~ error:', error);
    }
}

export async function deleteProfile() {
    try {
        return await AsyncStorage.removeItem('profile');
    } catch (error) {
        console.log('🚀 ~ deleteProfile ~ error:', error);
    }
}
