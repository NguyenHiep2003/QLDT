import {
    getNotificationRequest,
    getNotificationResponse, getUnreadCountResponse, markAsReadRequest, markAsReadResponse,
    sendNotificationRequest,
    sendNotificationResponse
} from "@/types/notification";
import {getProfileLocal} from "@/services/storages/profile";
import {Alert} from "react-native";
import {UnauthorizedException} from "@/utils/exception";
import instance from "@/services/api-calls/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getTokenLocal} from "@/services/storages/token";

const displayErrorAlert = (title: string, message: string) => {
    Alert.alert(title, message);
};

export async function getNotifications(request: getNotificationRequest) {
    const profile = await getProfileLocal();
    if (!profile) throw new UnauthorizedException('Profile not found');

    try {
        const response: getNotificationResponse = await instance.post('/it5023e/get_notifications', {
            index: request.index,
            count: request.count,
        });

        return response;
    } catch (error) {
        console.log("🚀 ~ getNotifications ~ error:", error)
    }
}

export async function sendNotification(request: sendNotificationRequest) {
    const profile = await getProfileLocal();
    if (!profile) throw new UnauthorizedException('Profile not found');

    const token = await getTokenLocal();
    if (!token) throw new UnauthorizedException();

    const formData = new FormData();
    formData.append("token", token as string);
    formData.append("message", request.message);
    formData.append("toUser", request.toUser);
    formData.append("type", request.type);

    try {
        const response: sendNotificationResponse = await instance.post('/it5023e/send_notification', formData, {
            headers: {
                'no-need-token': true,
                'Content-Type': 'multipart/form-data',
            }});

        // console.log('Sending push notification');
        const expoPushToken = await AsyncStorage.getItem('expoPushToken') as string
        console.log(expoPushToken)

        return response;
    } catch (error) {
        console.log("🚀 ~ sendNotification ~ error:", error)
    }
}

export async function markAsRead(request: markAsReadRequest) {
    const profile = await getProfileLocal();
    if (!profile) throw new UnauthorizedException('Profile not found');

    try {
        const response: markAsReadResponse = await instance.post('/it5023e/mark_notification_as_read', {
            notification_id: request.notification_id,
        });

        return response;
    } catch (error) {
        console.log("🚀 ~ markAsRead ~ error:", error)
    }
}

export async function getUnreadCount() {
    const profile = await getProfileLocal();
    if (!profile) throw new UnauthorizedException('Profile not found');

    try {
        const response: getUnreadCountResponse = await instance.post('/it5023e/get_unread_notification_count');

        return response;
    } catch (error) {
        console.log("🚀 ~ getUnreadCount ~ error:", error)
    }
}
