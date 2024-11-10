import Header from '@/components/Header';
import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="sign-in"
                options={{
                    animation: "none"
                }}
            />
            
            <Stack.Screen
                name="sign-up"
                options={{
                    headerTitle: "",
                    headerStyle: {
                        backgroundColor: '#a2131b',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: "center",
                    animation: 'slide_from_right',
                }}
            />

            <Stack.Screen
                name="verify-code"
                options={{
                    headerShown: true,
                    headerTitle: (props) => <Header />,
                    headerStyle: {
                        backgroundColor: '#c21c1c',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: "center",
                    animation: 'slide_from_right',
                }}
            />
        </Stack>
    );
}