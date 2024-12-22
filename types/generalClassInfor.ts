import { TStudentAccount } from './profile';

export enum ClassStatus {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    UPCOMING = 'UPCOMING',
}

export type ClassInfo = {
    class_id: string;
    class_name: string;
    attached_code: string;
    class_type: string;
    lecturer_name: string;
    student_count: number;
    start_date: string;
    end_date: string;
    status: ClassStatus;
    statusRegister: string;
    student_accounts: TStudentAccount[]; // can sua lai sau
};

export type PageInfo = {
    total_records: string;
    total_page: string;
    page_size: string;
    page: string;
    next_page: string;
    previous_page: string | null;
};

