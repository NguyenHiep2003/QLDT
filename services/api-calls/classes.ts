import { ROLES } from '@/constants/Roles';
import instance from './axios';
import { getProfileLocal } from '../storages/profile';
import {getTokenLocal} from "@/services/storages/token";
import {
    createClassRequest,
    createClassResponse, editClassRequest, editClassResponse,
    getClassInfoRequest,
    getClassInfoResponse
} from "@/types/createClassRequest";
import {TProfile} from "@/types/profile";
import exp from "node:constants";

export async function getClassList(role: ROLES) {
    const profile = await getProfileLocal();
    if (!profile) return [];
    const response = await instance.post('/it5023e/get_class_list', {
        role,
        account_id: profile.id,
    });
    return response.data;
}

export async function createClass(request: createClassRequest) {
    const profile = await getProfileLocal();
    if (!profile) return { meta: { code: 400, message: 'Profile not found' } };

    try {
        const response: createClassResponse = await instance.post('/it5023e/create_class', {
            class_id: request.class_id,
            class_name: request.class_name,
            class_type: request.class_type,
            start_date: request.start_date,
            end_date: request.end_date,
            max_student_amount: request.max_student_amount
        });

        return response;
    } catch (error) {
        throw new Error('Error creating class');
    }
}

export async function getClassInfo(request: getClassInfoRequest) {
    const profile = await getProfileLocal();
    if (!profile) return { meta: { code: 400, message: 'Profile not found' } };

    try {
        const response: getClassInfoResponse = await instance.post('/it5023e/get_class_info', {
            class_id: request.class_id,
            account_id: profile.id,
            role: profile.role
        })

        return response
    } catch (error) {
        throw new Error('Error get class info');
    }
}

export async function editClass(request: editClassRequest) {
    const profile = await getProfileLocal();
    if (!profile) return { meta: { code: 400, message: 'Profile not found' } };

    try {
        const response: editClassResponse = await instance.post('/it5023e/edit_class', {
            class_id: request.class_id,
            class_name: request.class_name,
            status: request.status,
            start_date: request.start_date,
            end_date: request.end_date,
        })

        return response;
    } catch (error) {
        throw new Error('Error update class')
    }
}
