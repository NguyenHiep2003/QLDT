import Header from '@/components/Header';
import { Stack } from 'expo-router';

import { StyleSheet } from 'react-native';

export default function StudentLayout() {
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
            {/* <Stack.Screen
                name="index"
            />
            <Stack.Screen
                name="student/(tabs)"
            ></Stack.Screen> */}
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
