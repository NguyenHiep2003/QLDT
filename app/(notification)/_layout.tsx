import { Stack } from 'expo-router';
import Header from "@/components/Header";
import { StyleSheet, Text } from 'react-native';
import NotificationBell from "@/components/navigation/NotificationBell";

export default function NotificationScreen() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
            }}
        >
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#c21c1c' },
                    headerTintColor: 'white',
                    headerTitle: () => <Header title="Thông báo"></Header>,
                    headerRight: () => (
                        NotificationBell()
                    )
                }}
                name="index"
            />
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

    header: {
        fontSize: 24,
        color: 'white',
    },
});
