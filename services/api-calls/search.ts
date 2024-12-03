import { SearchByMailResponse } from '@/types/search';
import instance from './axios';

export async function searchByEmail(
    search: string,
    pageNum = 0,
    pageSize = 10
): Promise<SearchByMailResponse> {
    try {
        return await instance.post('/it5023e/search_account', {
            search,
            pageable_request: {
                page: pageNum,
                page_size: pageSize,
            },
        });
    } catch (error) {
        console.log('🚀 ~ searchByEmail ~ error:', error);
        throw error;
    }
}
