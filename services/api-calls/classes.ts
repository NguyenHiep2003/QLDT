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

export async function getAttendanceList(classId: any, date: any) {
    const profile = await getProfileLocal();
    if (!profile) return [];
    const response = await instance.post('/it5023e/get_attendance_list', {
        class_id: classId,
        date: date
    })
    return response.data;
}

export async function getClassInfo(classId: any) {
    const profile = await getProfileLocal();
    if (!profile) return [];
    const response = await instance.post('/it5023e/get_class_info', {
        role: profile.role,
        account_id: profile.id,
        class_id: classId
    })
    return response.data;
}