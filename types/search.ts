export type SearchByMailResponse = {
    data: {
        page_content: AccountSearch[];
        page_info: {
            total_records: string;
            total_page: string;
            page_size: string;
            page: string;
            next_page: string;
            previous_page: string | null;
        };
    };
};

export type AccountSearch = {
    account_id: string;
    last_name: string;
    first_name: string;
    email: string;
};
