import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, TouchableOpacity, Modal, Alert, StyleSheet, Button} from 'react-native';
import { useUnreadCount } from '@/context/UnreadCountContext';
import { getNotifications, markAsRead, sendNotification } from '@/services/api-calls/notification';
import { getProfile } from '@/services/api-calls/profile';

interface Notification {
    id: number,
    message: string,
    status: string,
    from_user: number,
    to_user: number,
    type: string,
    recipient_id: null,
    sent_time: string
}

const NotificationScreen = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [user, setUser] = useState<{ [key: number]: string }>({});
    const { setUnreadCount } = useUnreadCount();

    useEffect(() => {
        fetchNotifications()
    }, []);

    const fetchSenderName = async (senderId: number) => {
        if (user[senderId]) {
            return user[senderId];
        }

        try {
            const response = await getProfile(senderId.toString());
            const fullName = response.name;
            setUser(prevUser => ({ ...prevUser, [senderId]: fullName }));
            return fullName;
        } catch (err) {
            console.log(err);
            return 'Unknown';
        }
    };

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response: any = await getNotifications({ index: 0, count: 50 });
            const notifications = response.data;
            for (const notification of notifications) {
                notification.from_user = await fetchSenderName(notification.from_user);
            }
            setNotifications(notifications);
            const unreadCount = notifications.filter((n: { status: string; }) => n.status === 'UNREAD').length;
            setUnreadCount(unreadCount);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
            Alert.alert('Error', 'Failed to load notifications');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        setSelectedNotification(notification);
        setIsModalVisible(true);

        if (notification.status === 'UNREAD') {
            try {
                const unreadCount = notifications.filter((n: { status: string; }) => n.status === 'UNREAD').length;
                setUnreadCount(unreadCount);
                await markAsRead({ notification_id: notification.id });
                setNotifications(prevNotifications =>
                    prevNotifications.map(n =>
                        n.id === notification.id ? { ...n, status: 'READ' } : n
                    )
                );
            } catch (err) {
                console.log(err);
                Alert.alert('Error', 'Failed to mark notification as read');
            }
        }
    };

    const renderNotification = ({ item }: { item: Notification }) => (
        <TouchableOpacity onPress={() => handleNotificationClick(item)}>
            <View style={[
                styles.notificationItem,
                item.status === 'READ' ? styles.readNotification : styles.unreadNotification
            ]}>
                <View style={styles.notificationHeader}>
                    <Text style={styles.senderName}>{item.from_user}</Text>
                    <Text style={styles.timestamp}>{formatDate(item.sent_time)}</Text>
                </View>
                <Text style={styles.content} numberOfLines={2} ellipsizeMode={"tail"}>{item.message}</Text>
                {item.status === 'UNREAD' && <View style={styles.unreadDot} />}
            </View>
        </TouchableOpacity>
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    const sendPushNoti = async () => {
        await sendNotification({
            message: 'Đã có điểm bài kiểm tra môn Lập trình ứng dụng cho thiết bị di động',
            toUser: '109',
            type: 'ABSENCE',
        })
    }

    return (
        <View style={styles.container}>
            <Button title="Send" onPress={() => sendPushNoti()}>

            </Button>
            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={item => item.id.toString()}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                onRefresh={fetchNotifications}
                refreshing={isLoading}
            />

            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Chi tiết thông báo</Text>
                        {selectedNotification && (
                            <>
                                <Text style={styles.modalText}>Người gửi: {selectedNotification.from_user}</Text>
                                <Text style={styles.modalText}>Thời gian: {formatDate(selectedNotification.sent_time)}</Text>
                                <Text style={styles.modalText}>Nội dung: {selectedNotification.message}</Text>
                            </>
                        )}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setIsModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e0e0e0',
    },
    list: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        gap: 12,
    },
    notificationItem: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    senderName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    timestamp: {
        color: '#666',
        fontSize: 14,
    },
    content: {
        fontSize: 15,
        color: '#333',
    },
    unreadNotification: {
        backgroundColor: '#f0f9ff',
        borderColor: '#bae6fd',
    },
    readNotification: {
        backgroundColor: 'white',
    },
    unreadDot: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#c21c1c',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#c21c1c',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default NotificationScreen;
