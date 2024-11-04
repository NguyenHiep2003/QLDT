import { ROLES } from '@/constants/role';
import instance from './axios';
import { getProfileLocal } from '../storages/profile';

export async function getClassList(role: ROLES) {
    const profile = await getProfileLocal();
    if (!profile) return [];
    const response = await instance.post('/it5023e/get_class_list', {
        role,
        account_id: profile.id,
    });
    return response.data;
}
