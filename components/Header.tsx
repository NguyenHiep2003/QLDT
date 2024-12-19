import React, { useCallback } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Href, router, useFocusEffect } from 'expo-router';
import { useUnreadCount } from '@/context/UnreadCountContext';
import { getUnreadCount } from '@/services/api-calls/notification';

export default function Header({ title = 'HUST' }: { title?: string }) {
    const { unreadCount, setUnreadCount } = useUnreadCount();

    useFocusEffect(
        useCallback(() => {
            getUnreadNotificationCount();
        }, [])
    );

    async function getUnreadNotificationCount() {
        const response: any = await getUnreadCount();
        setUnreadCount(response.data);
    }

    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
            <View style={{ position: 'relative' }}>
                <Ionicons
                    style={styles.icon}
                    name="notifications-outline"
                    size={24}
                    color="white"
                    onPress={() => router.navigate(`/(notification)` as Href<string>)}
                />
                {unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadCount}>{unreadCount}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
    },
    icon: {
        marginRight: 0,
    },
    unreadBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unreadCount: {
        color: 'white',
        fontSize: 12,
    },
});
