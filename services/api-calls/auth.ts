import { TProfile } from '@/types/profile';
import instance from './axios';
import { saveProfileLocal } from '../storages/profile';
import { getTokenLocal, saveTokenLocal } from '../storages/token';
import { UnauthorizedException } from '@/utils/exception';

type SignInResponse = {
    data: {
        id: number;
        ho: string;
        ten: string;
        token: string;
        name: string;
        email: string;
        active: string;
        role: string;
        class_list: any[];
        avatar: string;
    };
};

export async function signIn(email: string, password: string) {
    try {
        const response: SignInResponse = await instance.post('/it4788/login', {
            email,
            password,
            deviceId: 1,
        });
        const { ho, ten, id, name, active, role, class_list, avatar } =
            response.data;
        const profile: TProfile = {
            id,
            ho,
            ten,
            name,
            email,
            active,
            role,
            class_list,
            avatar,
        };
        await saveProfileLocal(profile);
        await saveTokenLocal(response.data.token);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            const message = error.response.data as String;

            if (message === 'User not found or wrong password') {
                console.log('Đăng nhập thất bại:', message);
                throw new Error(message.toString());
            } else if (message === 'Account is locked') {
                console.log('Tài khoản chưa được xác thực:', message);
                throw new Error(message.toString());
            } else {
                console.error('Đăng ký thất bại với mã lỗi khác:', message);
                throw new Error(message.toString());
            }
        } else {
            console.log('🚀 ~ signUp ~ error:', error);
            throw error;
        }
    }
}

type SignUpResponse = {
    status_code: number;
    message: string;
    verify_code: string;
};

type SignUpRequest = {
    ho: string;
    ten: string;
    email: string;
    password: string;
    uuid: number;
    role: string;
};

export async function signUp(signUpData: SignUpRequest) {
    try {
        const data: SignUpResponse = await instance.post(
            '/it4788/signup',
            signUpData
        );

        console.log(data);
        console.log(data.status_code);

        return data;
    } catch (error: any) {
        // Kiểm tra nếu có lỗi với response và có data từ server
        if (error.response && error.response.data) {
            const data = error.response.data as SignUpResponse;

            if (data.status_code === 9996) {
                console.log('Đăng ký thất bại (User existed):', data);
                return data;
            } else {
                console.error(
                    'Đăng ký thất bại với mã lỗi khác:',
                    data.message
                );
                throw new Error(data.message);
            }
        } else {
            console.log('🚀 ~ signUp ~ error:', error);
            throw error;
        }
    }
}

type CheckVerifyCodeResponse = {
    message: string;
    userId: number;
};

type CheckVerifyCodeRequest = {
    email: string;
    verify_code: string;
};

export async function CheckVerifyCode(
    checkVerifyCodeData: CheckVerifyCodeRequest
) {
    try {
        const data: CheckVerifyCodeResponse = await instance.post(
            '/it4788/check_verify_code',
            checkVerifyCodeData
        );

        console.log(data);
        console.log(data.message);

        return data;
    } catch (error: any) {
        // Kiểm tra nếu có lỗi với response và có data từ server
        if (error.response && error.response.data) {
            const errorData = error.response.data as string;

            // Phân tích chuỗi lỗi
            const [status_code, message] = errorData.split(' | ');

            // Kiểm tra mã lỗi 1004 và 1010
            if (status_code === '1004') {
                console.error(
                    'Mã xác thực không hợp lệ hoặc email không khớp:',
                    message
                );
                throw new Error('Mã xác thực không hợp lệ.');
            } else if (status_code === '1010') {
                console.error('Email đã được xác thực trước đó:', message);
                throw new Error('Email đã được xác thực trước đó.');
            } else {
                console.error('Lỗi khác từ server:', message);
                throw new Error(message);
            }
        } else {
            console.log('🚀 ~ CheckVerifyCode ~ error:', error);
            throw error;
        }
    }
}

type ResendVerifyCodeResponse = {
    data: string;
    meta: {
        code: number;
        message: string;
    };
};

export async function resendVerifyCode(email: string) {
    try {
        const data: ResendVerifyCodeResponse = await instance.post(
            '/it4788/get_verify_code',
            { email }
        );
        console.log('ResendVerifyCode success:', data);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            const errorData = error.response.data as string;
            const [status_code, message] = errorData.split(' | ');
            if (status_code === '1010') {
                throw new Error('Email đã được xác thực từ trước.');
            } else if (status_code === '1009') {
                throw new Error(
                    'Yêu cầu quá thường xuyên. Vui lòng thử lại sau.'
                );
            }
        } else {
            console.log('🚀 ~ resendVerifyCode ~ error:', error);
            throw error;
        }
    }
}

type ChangePasswordRequest = {
    token: string;
    old_password: string;
    new_password: string;
};

type ChangePasswordResponse = string;

export async function changePassword(
    changePassWordRequest: ChangePasswordRequest
) {
    try {
        const data: ChangePasswordResponse = await instance.post(
            '/it4788/change_password',
            changePassWordRequest
        );
        console.log(data);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            const errorData = error.response.data as string;
            console.log(errorData);
            const [status_code, message] = errorData.split(' | ');
            if (status_code === '9995') {
                throw new Error('Token is invalid');
            } else if (status_code === '1001') {
                throw new Error('Old password is incorrect');
            } else if (status_code === '1003') {
                throw new Error('New password is too similar to the old one');
            }
            /*Check mật khẩu mới hợp lệ hay không nữa, tài khoản đã bị khóa chưa*/
        } else {
            console.log('🚀 ~ changePassword ~ error:', error);
            throw error;
        }
    }
}

export async function logOut() {
    try {
        const token = await getTokenLocal();
        if (!token) throw new UnauthorizedException('Token not found');
        const res = await instance.post('/it4788/logout', { token });
        return;
    } catch (error) {
        console.log('🚀 ~ logOut ~ error:', error);
        throw error;
    }
}
