import Header from '@/components/Header';
import { Stack } from 'expo-router';

export default function ClassLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="assignments"
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
                }}
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
                }}
            ></Stack.Screen>
        </Stack>
    );
}
