import {useState, useEffect} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {getNotifications, markAsRead} from "@/services/api-calls/notification";
import {markAsReadResponse} from "@/types/notification";

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

const Notification = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch notifications when component mounts
    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response: any = await getNotifications({
                index: 0,
                count: 10,
            });

            if (response.meta.code !== 1000) {
                throw new Error('Failed to fetch notifications');
            }

            setNotifications(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
            Alert.alert('Error', 'Failed to load notifications');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        const ids = notifications.map(notification => notification.id);
        console.log(ids);
        try {
            const response: any = await markAsRead({
                notification_ids: ids
            });

            if (response.meta.code !== 1000) {
                throw new Error('Failed to mark notifications as read');
            }
        } catch (err) {
            console.log(err);
            Alert.alert('Error', 'Failed to mark notifications as read');
        }
    };

    const handleSendNewNotification = () => {
        Alert.alert('Send Notification', 'Add your notification sending logic here');
    };

    const renderNotification = ({ item }: { item: Notification }) => (
        <View style={[
            styles.notificationItem,
            item.status === 'READ' ? styles.readNotification : styles.unreadNotification
        ]}>
            <View style={styles.notificationHeader}>
                <Text style={styles.senderName}>{item.from_user}</Text>
                <Text style={styles.timestamp}>{item.sent_time}</Text>
            </View>
            <Text style={styles.content} numberOfLines={2} ellipsizeMode={"tail"}>{item.message}</Text>
            {item.status === 'UNREAD' && <View style={styles.unreadDot} />}
        </View>
    );

    // Loading state
    if (isLoading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text>Loading notifications...</Text>
            </View>
        );
    }

    // Error state
    if (error) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={fetchNotifications}
                >
                    <Text style={styles.buttonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleMarkAllAsRead}
                    >
                        <Text style={styles.buttonText}>Mark all as read</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.sendButton]}
                        onPress={handleSendNewNotification}
                    >
                        <Ionicons name="add" size={20} color="white" />
                        <Text style={styles.buttonText}>New Notification</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={notifications}
                renderItem={renderNotification}
                keyExtractor={item => item.id.toString()}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                onRefresh={fetchNotifications}
                refreshing={isLoading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e0e0e0',
    },
    header: {
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#c21c1c',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        padding: 8,
        borderRadius: 8,
        gap: 4,
    },
    sendButton: {
        backgroundColor: '#34C759',
    },
    buttonText: {
        color: 'white',
        fontWeight: '500',
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
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#c21c1c',
        padding: 12,
        borderRadius: 8,
    },
});

export default Notification;
