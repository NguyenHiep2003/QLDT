import { ROLES } from '@/constants/Roles';
import instance from './axios';
import { getProfileLocal } from '../storages/profile';
import {getTokenLocal} from "@/services/storages/token";
import {
    createClassRequest,
    createClassResponse, editClassRequest, editClassResponse,
    getClassInfoRequest,
    getClassInfoResponse,
    getClassOpenResponse,
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

export async function getAttendanceList(classId: any, date: any,page: any = null, page_size: any = null) {//SGHB - TODO
    const profile = await getProfileLocal();
    if (!profile) return [];

    var pageable_request = null

    if(page != null && page_size != null){
        pageable_request = {
            page: page,
            page_size: page_size
        }
    }

    try{
        const response = await instance.post('/it5023e/get_attendance_list', {
            class_id: classId,
            date: date,
            pageable_request: pageable_request
        })
        return response.data;
    } catch(error: any){
        if (error.rawError){
            const errorCode = error.rawError?.meta?.code;
            if(errorCode == "1004"){
                error.setTitle("Thông báo");
                error.setContent("Thời gian tra cứu không thuộc thời gian mở lớp");
            }
        } else if(error.request){
            error.setTitle("Lỗi");
            error.setContent("Máy chủ không phản hồi!");
        }

        throw error
    }
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

export async function takeAttendance(classId: any, date: any, attendanceList: any[]) {//SGHB - checked
    const profile = await getProfileLocal();
    if (!profile) return [];
    try{
        const response = await instance.post('/it5023e/take_attendance', {
            class_id: classId,
            date: date,
            attendance_list: attendanceList
        })
        return response.data;
    } catch(error: any){
        if (error.rawError){
            const errorCode = error.rawError?.meta?.code;
            if(errorCode == "1004"){
                error.setTitle("Lỗi");
                error.setContent("Thời gian điểm danh không hợp lệ!");
            } else if( errorCode == "9994"){
                error.setTitle("Lỗi");
                error.setContent("Không tìm thấy lớp bạn muốn điểm danh!");
            }
        } else if(error.request){
            error.setTitle("Lỗi");
            error.setContent("Máy chủ không phản hồi!");
        }
        throw error
    }
}

export async function setAttendanceStatus(status: any, attendanceId: any) {//SGHB - checked
    const profile = await getProfileLocal();
    if (!profile) return [];
    try{
        const response = await instance.post('/it5023e/set_attendance_status', {
            status: status,
            attendance_id: attendanceId
        })
        return response.data;
    } catch(error: any){
        if (error.rawError){
            const errorCode = error.rawError?.meta?.code;
            if(errorCode == "9994"){
                error.setTitle("Lỗi");
                error.setContent("Không tìm thấy bản ghi điểm danh!");
            }
        } else if(error.request){
            error.setTitle("Lỗi");
            error.setContent("Máy chủ không phản hồi!");
        }
        throw error
    }
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

export async function getAttendanceRecord(classId: any) {//SGHB - checked
    const profile = await getProfileLocal();
    if (!profile) return { meta: { code: 400, message: 'Profile not found' } };

    try {
        const response = await instance.post('/it5023e/get_attendance_record', {
            class_id: classId,
        })

        return response.data;
    } catch (error: any) {
        if (error.rawError){
            const errorCode = error.rawError?.meta?.code;
            if(errorCode == "9994"){
                error.setTitle("Lỗi");
                error.setContent("Không tìm thấy lớp!");
            }
        } else if(error.request){
            error.setTitle("Lỗi");
            error.setContent("Máy chủ không phản hồi!");
        }
        throw error
    }
}

export async function requestAbsence(form: FormData) {//SGHB -- checked
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
    } catch(error: any) {
        if (error.rawError){
            const errorCode = error.rawError?.meta?.code;
            if(errorCode == "9994"){
                error.setTitle("Lỗi");
                error.setContent("Không thể gửi đơn xin nghỉ đến lớp này!"); // lớp không hợp lệ or sv ko thuộc về lớp này
            } else if(errorCode == "1004"){
                error.setTitle("Lỗi");
                error.setContent("Thông tin gửi đi không hợp lệ!");
            }
        } else if(error.request){
            error.setTitle("Lỗi");
            error.setContent("Máy chủ không phản hồi!");
        }
        throw error
    }
}

export async function getAbsenceRequests(classId: any,page: any = null, page_size: any = null, status: any = null, date: any = null) {//SGHB -- checked
    const profile = await getProfileLocal();
    if (!profile) return { meta: { code: 400, message: 'Profile not found' } };

    var pageable_request = null

    if(page != null && page_size != null){
        pageable_request = {
            page: page,
            page_size: page_size
        }
    }

    try {
        const response = await instance.post('/it5023e/get_absence_requests', {
            class_id: classId,
            status: status,
            date: date,
            pageable_request: pageable_request
        })
        return response.data;
    } catch (error: any) {
        if (error.rawError){
            const errorCode = error.rawError?.meta?.code;
            if(errorCode == "9994"){
                error.setTitle("Lỗi");
                error.setContent("Không tìm thấy lớp!");
            } else if(errorCode == "1004"){
                error.setTitle("Lỗi");
                error.setContent("Giá trị tham số không hợp lệ!");
            }
        } else if(error.request){
            error.setTitle("Lỗi");
            error.setContent("Máy chủ không phản hồi!");
        }

        throw error
    }
}

export async function getStudentAbsenceRequests(class_id: any = null, page: any = null, page_size: any = null, status: any = null, date: any = null) {//SGHB - checked
    const profile = await getProfileLocal();
    if (!profile) return { meta: { code: 400, message: 'Profile not found' } };

    var pageable_request = null

    if(page != null && page_size != null){
        pageable_request = {
            page: page,
            page_size: page_size
        }
    }

    try{
        const response = await instance.post('/it5023e/get_student_absence_requests', {
            class_id: class_id,
            status: status,
            date: date,
            pageable_request: pageable_request
        })
        return response.data
    } catch(error: any){
        if (error.rawError){
            const errorCode = error.rawError?.meta?.code;
            if(errorCode == "9994"){
                error.setTitle("Lỗi");
                error.setContent("Không tìm thấy lớp!");
            } else if( errorCode == "1004"){
                error.setTitle("Lỗi");
                error.setContent("Ngày truy vấn không thuộc thơi gian mở lớp!");
            }
        } else if(error.request){
            error.setTitle("Lỗi");
            error.setContent("Máy chủ không phản hồi!");
        }
        throw error
    }
    
}

export async function reviewAbsenceRequest(requestId: any,status: any) {//SGHB - checked
    const profile = await getProfileLocal();
    if (!profile) return { meta: { code: 400, message: 'Profile not found' } };

    try {
        const response = await instance.post('/it5023e/review_absence_request', {
            request_id: requestId,
            status: status
        })
        return response.data;
    } catch (error: any) {
        if (error.rawError){
            const errorCode = error.rawError?.meta?.code;
            if(errorCode == "1009"){
                error.setTitle("Lỗi");
                error.setContent("Giảng viên không có quyền xem xét đơn xin nghỉ này!");
            } else if(errorCode == "9999"){ //warning: error code should be 9994
                error.setTitle("Lỗi");
                error.setContent("Không tìm thấy đơn xin nghỉ tương ứng!");
            }
        } else if(error.request){
            error.setTitle("Lỗi");
            error.setContent("Máy chủ không phản hồi!");
        }
        throw error
    }
}

export async function getOpenClassList(pageable_request: any):  Promise<getClassOpenResponse | { meta: { code: number; message: string } }>{
    const profile = await getProfileLocal();
    if (!profile) return { meta: { code: 400, message: 'Profile not found' } };

    try {
        const response: getClassOpenResponse = await instance.post('/it5023e/get_open_classes', {
            pageable_request: pageable_request
        })
        return response;
    } catch (error) {
        throw error
    }

}

export async function getOpenClassByFilter(request: any):  Promise<getClassOpenResponse | { meta: { code: number; message: string } }>{
    const profile = await getProfileLocal();
    if (!profile) return { meta: { code: 400, message: 'Profile not found' } };
    console.log("request", request)

    try {
        
        const response: getClassOpenResponse = await instance.post('/it5023e/get_classes_by_filter', {
        class_id: request.class_id,
        status: request.status,
        class_name: request.class_name,
        class_type: request.class_type, 
        pageable_request : request.pageable_request
        })
        
        return response;
    } catch (error) {    
        throw error
    }

}
export async function getAttendanceDates(class_id: any){//SGHB - checked
    const profile = await getProfileLocal();
    if (!profile) return { meta: { code: 400, message: 'Profile not found' } };

    try{
        const response = await instance.post('/it5023e/get_attendance_dates', {
            class_id: class_id
        })
        return response.data
    } catch(error: any){
        if(error.rawError){
            const errorCode = error.rawError?.meta?.code;
            if(errorCode == "9994"){
                error.setTitle("Lỗi");
                error.setContent("Lớp học không tồn tại!");
            }
        } else if(error.request){
            error.setTitle("Lỗi");
            error.setContent("Máy chủ không phản hồi!");
        }
        throw error
    }
}

