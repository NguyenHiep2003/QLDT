import { TProfile } from '@/types/profile';
import instance from './axios';
import { getTokenLocal } from '../storages/token';
import { UnauthorizedException } from '@/utils/exception';

export async function changeProfile(form: FormData): Promise<TProfile> {
    try {
        const token = await getTokenLocal();
        if (!token) throw new UnauthorizedException();
        form.append('token', token);
        const res = await instance.post(
            '/it4788/change_info_after_signup',
            form,
            {
                headers: {
                    'no-need-token': true,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return res.data;
    } catch (error) {
        console.log('🚀 ~ changeProfile ~ error:', error);
        throw error;
    }
}

export async function getProfile(id: string): Promise<TProfile> {
    try {
        const response = await instance.post('/it4788/get_user_info', {
            user_id: id,
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ getProfile ~ error:', error);
        throw error;
    }
}
