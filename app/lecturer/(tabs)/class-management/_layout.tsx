import { Stack } from 'expo-router';

import { StyleSheet, Text } from 'react-native';

export default function ClassManagementLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#c21c1c' },
                    headerTitle: (props) => (
                        <Text style={styles.header}>TẠO LỚP HỌC</Text>
                    ),
                }}
                name="create-class"
            />
             <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: '#c21c1c' },
                    headerTitle: (props) => (
                        <Text style={styles.header}>CHỈNH SỬA THÔNG TIN LỚP HỌC</Text>
                    ),
                }}
                name="[classId]"
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
        fontSize: 20,
        color: 'white',
    },
});
