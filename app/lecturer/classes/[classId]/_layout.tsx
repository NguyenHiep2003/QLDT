import Header from '@/components/Header';
import { Stack } from 'expo-router';
import NotificationBell from "@/components/navigation/NotificationBell";

export default function ClassLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="assignments"
                options={{ headerShown: false }}
            ></Stack.Screen>
            <Stack.Screen
                name="attendances"
                options={{
                    headerStyle: {
                        backgroundColor: '#c21c1c',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: 'center',
                    headerTitle: () => <Header title="Điểm danh"></Header>,
                    headerRight: () => (
                        NotificationBell()
                    )
                }}
            ></Stack.Screen>
            <Stack.Screen
                name="documents"
                options={{
                    headerStyle: {
                        backgroundColor: '#c21c1c',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: 'center',
                    headerTitle: () => <Header title="Tài liệu"></Header>,
                    headerRight: () => (
                        NotificationBell()
                    )
                }}
            ></Stack.Screen>
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
                    headerTitle: () => <Header title="Lớp học"></Header>,
                    headerRight: () => (
                        NotificationBell()
                    )
                }}
            ></Stack.Screen>
        </Stack>
    );
}
