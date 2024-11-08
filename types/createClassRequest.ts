export type createClassRequest = {
    class_id: string;
    class_name: string;
    class_type: string;
    start_date: string;
    end_date: string;
    max_student_amount: number
}

export type createClassResponse = {
    data: {
        id: number,
        class_id: string,
        class_name: string,
        schedule: null,
        lecturer_id: number,
        max_student_amount: number,
        attached_code: null,
        class_type: string,
        start_date: string,
        end_date: string,
        status: string
    },
    meta: {
        code: number,
        message: string
    }
}

export type getClassInfoRequest = {
    class_id: string
}

export type getClassInfoResponse = {
    data: {
        class_id: string,
        class_name: string,
        attached_code: null,
        class_type: string,
        lecturer_name: string,
        student_count: number,
        start_date: string,
        end_date: string,
        status: string
        student_accounts: null  // can sua lai sau
    },
    meta: {
        code: number,
        message: string
    }
}

export type editClassRequest = {
    class_id: string,
    class_name: string,
    status: string
    start_date: string,
    end_date: string
}

export type editClassResponse = {
    data: {
        id: number,
        class_id: string,
        class_name: string,
        schedule: null,
        lecturer_id: number,
        max_student_amount: number,
        attached_code: null,
        class_type: string,
        start_date: string,
        end_date: string,
        status: string
    },
    meta: {
        code: number,
        message: string
    }
}
