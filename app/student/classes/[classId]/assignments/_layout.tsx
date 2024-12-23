import Header from '@/components/Header';
import { Stack } from 'expo-router';
import NotificationBell from '@/components/navigation/NotificationBell';

export default function ClassLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="(tabs)"
                options={{
                    headerStyle: {
                        backgroundColor: '#c21c1c',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: 'center',
                    headerTitle: () => <Header title="Bài tập"></Header>,
                    headerRight: () => NotificationBell(),
                }}
            ></Stack.Screen>
            <Stack.Screen
                name="[assignmentId]"
                options={{
                    headerStyle: {
                        backgroundColor: '#c21c1c',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: 'center',
                    headerTitle: () => (
                        <Header title="Chi tiết bài tập"></Header>
                    ),
                    headerRight: () => NotificationBell(),
                }}
            ></Stack.Screen>
        </Stack>
    );
}
