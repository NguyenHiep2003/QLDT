import * as SecureStore from 'expo-secure-store';

export async function saveTokenLocal(token: string) {
    try {
        return await SecureStore.setItemAsync('token', token);
    } catch (error) {
        console.log('🚀 ~ saveTokenLocal ~ error:', error);
        throw error;
    }
}

export async function getTokenLocal() {
    try {
        const token = await SecureStore.getItemAsync('token');
        return token;
    } catch (error) {
        console.log('🚀 ~ getToken ~ error:', error);
    }
}

export async function deleteToken() {
    try {
        return await SecureStore.deleteItemAsync('token');
    } catch (error) {
        console.log('🚀 ~ deleteToken ~ error:', error);
    }
}
