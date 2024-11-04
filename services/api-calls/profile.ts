import instance from './axios';

export async function changeUsername(newUsername: string) {
    try {
        await instance.post('/it4788/change_info_after_signup', {
            username: newUsername,
        });
    } catch (error) {
        console.log('🚀 ~ changeUsername ~ error:', error);
        throw error;
    }
}

export async function getProfile(id: number) {
    try {
        const response = await instance.post('/it4788/get_user_info', {
            user_id: id,
        });
        return response.data;
    } catch (error) {
        console.log('🚀 ~ getProfile ~ error:', error);
        throw error;
    }
}
