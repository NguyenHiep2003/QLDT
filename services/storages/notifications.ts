import AsyncStorage from '@react-native-async-storage/async-storage';

export async function cacheNotification(notifications: any) {
    try {
        return await AsyncStorage.setItem(
            'notifications',
            JSON.stringify(notifications)
        );
    } catch (error) {
        console.log(
            '🚀 ~ file: notifications.ts:5 ~ cacheNotification ~ error:',
            error
        );
    }
}

export async function getNotificationCache() {
    try {
        const data = await AsyncStorage.getItem('notifications');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.log(
            '🚀 ~ file: notifications.ts:21 ~ getNotificationCache ~ error:',
            error
        );
    }
}
