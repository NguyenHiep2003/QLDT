import Header from '@/components/Header';
import { Stack } from 'expo-router';
import NotificationBell from "@/components/navigation/NotificationBell";

export default function ChatLayout() {
    return (
        <Stack screenOptions={{ headerShown: true }}>
            <Stack.Screen
                name="index"
                options={{
                    headerStyle: {
                        backgroundColor: '#c21c1c',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: 'center',
                    headerTitle: () => <Header title="Trò chuyện"></Header>,
                    headerRight: () => (
                        NotificationBell()
                    )
                }}
            ></Stack.Screen>
            <Stack.Screen
                name="search"
                options={{
                    headerStyle: {
                        backgroundColor: '#c21c1c',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: 'center',
                    headerTitle: () => <Header title="Tìm kiếm"></Header>,
                }}
            ></Stack.Screen>
        </Stack>
    );
}
