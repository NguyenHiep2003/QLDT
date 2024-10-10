import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{ tabBarActiveTintColor: '#c21c1c', headerShown: false }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Trang chủ',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="home" color={color}/>
                    ),
                   }}
            />
            <Tabs.Screen
                name="class-management"
                options={{
                    title: 'Quản lý lớp',
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="plus" color={color} />
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