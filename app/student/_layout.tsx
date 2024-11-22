import Header from '@/components/Header';
import { connectSocket } from '@/services/sockets/connection';
import { getProfileLocal } from '@/services/storages/profile';
import { useSocketContext } from '@/utils/socket.ctx';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

import { StyleSheet } from 'react-native';

export default function StudentLayout() {
    const { setStompClient } = useSocketContext();
    useEffect(() => {
        getProfileLocal().then((profile) => {
            if (profile?.id) setStompClient(connectSocket(profile.id));
        });
    }, []);
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#c21c1c',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerTitleAlign: 'center',
            }}
        >
            <Stack.Screen
                name="classes/[classId]"
                options={{ headerShown: false }}
            ></Stack.Screen>
            <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }}
            ></Stack.Screen>
            <Stack.Screen
                name="changePassword"
                options={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: '#c21c1c',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: 'center',
                    headerTitle: () => <Header title="Đổi mật khẩu"></Header>,
                }}
            ></Stack.Screen>
        </Stack>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 50,
        height: 50,
    },
});
