import { TProfile } from '@/types/profile';
import instance from './axios';
import { saveProfileLocal } from '../storages/profile';
import { saveTokenLocal } from '../storages/token';

type SignInResponse = {
    id: number;
    ho: string;
    ten: string;
    token: string;
    username: string;
    active: string;
    role: string;
    class_list: any[];
    avatar: string;
};

export async function signIn(email: string, password: string) {
    try {
        const data: SignInResponse = await instance.post('/it4788/login', {
            email,
            password,
            deviceId: 1
        });
        const { ho, ten, id, username, active, role, class_list, avatar } =
            data;
        const profile: TProfile = {
            id,
            ho,
            ten,
            username,
            active,
            role,
            class_list,
            avatar,
        };
        await saveProfileLocal(profile);
        await saveTokenLocal(data.token);
        return data;
    } catch (error) {
        console.log('🚀 ~ signIn ~ error:', error);
        throw error;
    }
}
