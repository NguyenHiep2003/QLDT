export type getNotificationRequest = {
    index: number,
    count: number,
}

export type getNotificationResponse = {
    data: {
        id: number,
        message: string,
        status: string,
        from_user: number,
        to_user: number,
        type: string,
        recipient_id: null,
        sent_time: string
    }
    meta: {
        code: number,
        message: string
    }
}

export type sendNotificationRequest = {
    message: string;
    to_user: number;
    type: string;
}

export type sendNotificationResponse = {
    data: string;
    meta: {
        code: number;
        message: string;
    }
}

export type markAsReadRequest = {
    notification_id: number;
}

export type markAsReadResponse = {
    data: string;
    meta: {
        code: number;
        message: string;
    }
}

export type getUnreadCountResponse = {
    data: number;
    meta: {
        code: number;
        message: string;
    }
}
