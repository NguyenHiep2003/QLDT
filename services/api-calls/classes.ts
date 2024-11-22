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

export async function getClassList(role: ROLES) {
    const profile = await getProfileLocal();
    const token = await getTokenLocal()
    console.log('token: ', token)
    if (!profile) throw new UnauthorizedException();
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

// export async function getClassInfo(classId: any) {
//     const profile = await getProfileLocal();
//     if (!profile) return [];
//     const response = await instance.post('/it5023e/get_class_info', {
//         role: profile.role,
//         account_id: profile.id,
//         class_id: classId
//     })
//     return response.data;
// }

export async function takeAttendance(classId: any, date: any, attendanceList: any[]) {
    const profile = await getProfileLocal();
    if (!profile) return [];
    const response = await instance.post('/it5023e/take_attendance', {
        class_id: classId,
        date: date,
        attendance_list: attendanceList
    })
    return response.data;
}

export async function setAttendanceStatus(status: any, attendanceId: any) {
    const profile = await getProfileLocal();
    if (!profile) return [];
    const response = await instance.post('/it5023e/set_attendance_status', {
        status: status,
	    attendance_id: attendanceId
    })
    return response.data;
}
export async function registerClass(class_ids: string[]) {
    const response = await instance.post('/it5023e/register_class', {
        class_ids: class_ids,
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
    if (!profile) throw new UnauthorizedException('Profile not found');

    try {
        const response: getClassInfoResponse = await instance.post('/it5023e/get_class_info', {
            class_id: request.class_id,
            account_id: profile.id,
            role: profile.role
        })

        return response
    } catch (error) {
        console.log("🚀 ~ getClassInfo ~ error:", error)
        throw error;
    }
}

export async function getBasicClassInfo(request: getClassInfoRequest) {
    const profile = await getProfileLocal();
    if (!profile) throw new Error('Profile not found');

    try {
        const response: getClassInfoResponse = await instance.post('/it5023e/get_basic_class_info', {
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

export async function getAttendanceRecord(classId: any) {
    const profile = await getProfileLocal();
    if (!profile) return { meta: { code: 400, message: 'Profile not found' } };

    try {
        const response = await instance.post('/it5023e/get_attendance_record', {
            class_id: classId,
        })

        return response;
    } catch (error) {
        throw new Error('Error get attendance record')
    }
}

export async function requestAbsence(form: FormData) {
    const profile = await getProfileLocal();
    if (!profile) return { meta: { code: 400, message: 'Profile not found' } };
    try{
        const token = await getTokenLocal()
        if(!token) throw new UnauthorizedException()
        form.append('token', token)
        const response = await instance.post('/it5023e/request_absence',
            form,
            {
                headers: {
                    'no-need-token': true,
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return response.data
    } catch(error) {
        throw error
        
    }
}

export async function getAbsenceRequests(classId: any,page: any, page_size: any, status: any = null) {
    const profile = await getProfileLocal();
    if (!profile) return { meta: { code: 400, message: 'Profile not found' } };

    try {
        const response = await instance.post('/it5023e/get_absence_requests', {
            class_id: classId,
            status: status,
            pageable_request: {
                page: page,
                page_size: page_size
            }
        })
        return response;
    } catch (error) {
        throw error
    }
}

export async function reviewAbsenceRequest(requestId: any,status: any) {
    const profile = await getProfileLocal();
    if (!profile) return { meta: { code: 400, message: 'Profile not found' } };

    try {
        const response = await instance.post('/it5023e/review_absence_request', {
            request_id: requestId,
            status: status
        })
        return response;
    } catch (error) {
        throw error
    }
}