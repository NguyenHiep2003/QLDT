import { ROLES } from '@/constants/Roles';
import { getProfileLocal } from '@/services/storages/profile';
import { getTokenLocal } from '@/services/storages/token';
import { TProfile } from '@/types/profile';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';

export default function Index() {
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
    return <Redirect href={'/(auth)/sign-in'} />;
}
