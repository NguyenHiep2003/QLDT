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
import admin from "firebase-admin";
import axios from "axios";

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

// export async function sendNotification(request: sendNotificationRequest) {
//     const profile = await getProfileLocal();
//     if (!profile) throw new UnauthorizedException('Profile not found');
//
//     try {
//         const response: sendNotificationResponse = await instance.post('/it5023e/send_notification', {
//             message: request.message,
//             to_user: request.to_user,
//             type: request.type,
//         });
//
//         return response;
//     } catch (error) {
//         console.log("🚀 ~ sendNotification ~ error:", error)
//     }
// }



export async function markAsRead(request: markAsReadRequest) {
    const profile = await getProfileLocal();
    if (!profile) throw new UnauthorizedException('Profile not found');

    try {
        const response: markAsReadResponse = await instance.post('/it5023e/mark_notification_as_read', {
            notification_ids: request.notification_ids,
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
