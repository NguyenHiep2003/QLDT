import { ROLES } from '@/constants/Roles';
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

export async function getClassInfo(class_id: string) {
    const profile = await getProfileLocal();
    if (!profile) throw new Error('Profile not found');

    const body = {
        role: ROLES.STUDENT,
        account_id: profile.id,
        class_id: class_id,
    };

    const response = await instance.post('/it5023e/get_basic_class_info', body);
    return response.data;
}

export async function registerClass(class_ids: string[]) {
    const response = await instance.post('/it5023e/register_class', {
        class_ids: class_ids,
    });
    return response.data;
}
