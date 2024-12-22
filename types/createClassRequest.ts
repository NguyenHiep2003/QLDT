import { ClassInfo, PageInfo}from './generalClassInfor';
import { TStudentAccount } from './profile';

export type createClassRequest = {
    class_id: string;
    class_name: string;
    class_type: string;
    start_date: string;
    end_date: string;
    max_student_amount: number;
};

export type createClassResponse = {
    data: {
        id: number;
        class_id: string;
        class_name: string;
        schedule: null;
        lecturer_id: number;
        max_student_amount: number;
        attached_code: null;
        class_type: string;
        start_date: string;
        end_date: string;
        status: string;
    };
    meta: {
        code: number;
        message: string;
    };
};

export type getClassInfoRequest = {
    class_id: string;
};

export type getClassInfoResponse = {
    data: ClassInfo,
    meta: {
        code: number;
        message: string;
    };
};

export type getClassOpenResponse = {
    data: {
        page_content: ClassInfo[];
        page_info: PageInfo;
    };
    meta: {
        code: string;
        message: string;
    };
};

export type editClassRequest = {
    class_id: string;
    class_name: string;
    status: string;
    start_date: string;
    end_date: string;
};

export type editClassResponse = {
    data: {
        id: number;
        class_id: string;
        class_name: string;
        schedule: null;
        lecturer_id: number;
        max_student_amount: number;
        attached_code: null;
        class_type: string;
        start_date: string;
        end_date: string;
        status: string;
    };
    meta: {
        code: number;
        message: string;
    };
};
