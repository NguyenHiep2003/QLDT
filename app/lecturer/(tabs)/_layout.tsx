import Header from '@/components/Header';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#c21c1c',
                headerShown: true,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Trang chủ',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="home" color={color} />
                    ),
                    headerStyle: {
                        backgroundColor: '#c21c1c',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign:"center",
                    headerTitle: () => (
                        <Header></Header>
                    ),
                }}
            />
            <Tabs.Screen
                name="class-management"
                options={{
                    unmountOnBlur: true,
                    title: 'Quản lý lớp',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="plus" color={color} />
                    ),
                    headerStyle: {
                        backgroundColor: '#c21c1c',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign:"center",
                    headerTitle: () => (
                        <Header title="Quản lý lớp học"></Header>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="user" color={color} />
                    ),
                    headerStyle: {
                        backgroundColor: '#c21c1c',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign:"center",
                    headerTitle: () => (
                        <Header title="Thông tin tài khoản"></Header>
                    ),
                }}
            />
                <Tabs.Screen
                name="chat"
                options={{
                    unmountOnBlur: true,
                    title: 'Trò chuyện',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="wechat" color={color} />
                        // <ChatIcon color={color}></ChatIcon>
                    ),
                    headerShown: false
                    // headerStyle: {
                    //     backgroundColor: '#c21c1c',
                    // },
                    // headerTintColor: '#fff',
                    // headerTitleStyle: {
                    //     fontWeight: 'bold',
                    // },
                    // headerTitleAlign: 'center',
                    // headerTitle: () => (
                    //     <Header title="Trò chuyện"></Header>
                    // ),
                }}
            />
        </Tabs>
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
