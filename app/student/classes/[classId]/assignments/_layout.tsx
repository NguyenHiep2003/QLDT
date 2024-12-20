import Header from '@/components/Header';
import { Stack } from 'expo-router';

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
                    headerTitle: () => <Header title="Danh sách bài tập"></Header>,
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
                    headerTitle: () => <Header title="Chi tiết bài tập"></Header>,
                }}
            ></Stack.Screen>
        </Stack>
    );
}
