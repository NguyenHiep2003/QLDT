import { ROLES } from '@/constants/Roles';
import { getProfileLocal } from '@/services/storages/profile';
import { getTokenLocal } from '@/services/storages/token';
import { TProfile } from '@/types/profile';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import {Text, View} from 'react-native';
import { TextEncoder } from 'text-encoding';
import {useNotification} from "@/context/NotificationContext";

global.TextEncoder = TextEncoder;
export default function Index() {
    const { expoPushToken, notification, error } = useNotification();
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<TProfile | undefined>(undefined);
    const [token, setToken] = useState<string | null | undefined>(undefined);
    useEffect(() => {
        const p1 = getProfileLocal().then((data) => setProfile(data));
        const p2 = getTokenLocal().then((token) => setToken(token));
        Promise.all([p1, p2]).finally(() => setIsLoading(false));
    }, []);
    if (isLoading) {
        return <Text>Loading...</Text>;
    }
    if (token && profile) {
        console.log(profile);
        if (profile.role == ROLES.LECTURER)
            return <Redirect href={'/lecturer'} />;
        else return <Redirect href={'/student'} />;
    }
    return (
        <View>
            <Redirect href={'/(auth)/sign-in'} />
            <Text>{JSON.stringify(notification?.request.content.data, null, 2)}</Text>
        </View>
    );
}
