import { Stack } from 'expo-router';
import Header from "@/components/Header";
import { StyleSheet, Text } from 'react-native';

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
                    headerTitle: () => <Header title="Thông báo"></Header>,
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
