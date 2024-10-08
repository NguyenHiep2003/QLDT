import Header from '@/components/Header';
import { Stack } from 'expo-router';

import { Text, View, Image, StyleSheet } from 'react-native';

function LogoTitle() {
    return (
        <Image
            style={styles.image}
            source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
        />
    );
}
export default function RootLayout() {
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
                headerTitleAlign:"center",
                headerTitle: (props) => <Header />,
            }}
        >
            <Stack.Screen
                name="index"
            />
            <Stack.Screen
                name="student"
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
