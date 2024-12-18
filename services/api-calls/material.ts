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
import { UnauthorizedException } from '@/utils/exception';
import _ from 'lodash';

export async function getMaterialList(classId: any) {
    const profile = await getProfileLocal();
    if (!profile) throw new UnauthorizedException();
    const response = await instance.post('/it5023e/get_material_list', { 
        class_id: classId,
    });
    return response;
}

export async function uploadMaterial(formData: FormData) {
    const profile = await getProfileLocal();
    if (!profile) throw new UnauthorizedException();

    try {
        const token = await getTokenLocal();
        if (!token) throw new UnauthorizedException();
        
        console.log('formData', formData);
        const response = await instance.post('/it5023e/upload_material', formData,
            {
                headers: {
                    "no-need-token": true,
                    'Content-Type': 'multipart/form-data',
                }
            }
            ); 

        return response.data;
    } catch (error) {
        throw error;
        
    }
}

export async function deleteMaterial(materialId: any) {
    const profile = await getProfileLocal();
    if (!profile) throw new UnauthorizedException();
    const response = await instance.post('/it5023e/delete_material', { 
        material_id: materialId,
    });
    return response;
}



