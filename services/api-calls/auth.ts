import { TProfile } from "@/types/profile";
import instance from "./axios";
import { saveProfileLocal } from "../storages/profile";
import { saveTokenLocal } from "../storages/token";

type SignInResponse = {
  id: number;
  ho: string;
  ten: string;
  token: string;
  username: string;
  active: string;
  role: string;
  class_list: any[];
  avatar: string;
};

export async function signIn(email: string, password: string) {
  try {
    const data: SignInResponse = await instance.post("/it4788/login", {
      email,
      password,
      deviceId: 1,
    });
    const { ho, ten, id, username, active, role, class_list, avatar } = data;
    const profile: TProfile = {
      id,
      ho,
      ten,
      username,
      active,
      role,
      class_list,
      avatar,
    };
    await saveProfileLocal(profile);
    await saveTokenLocal(data.token);
    return data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const message = error.response.data as String;

      if (message === "User not found or wrong password") {
        console.log("Đăng ký thất bại (User existed):", message);
        throw new Error(message.toString());
        
      } else {
        console.error("Đăng ký thất bại với mã lỗi khác:", message);
        throw new Error(message.toString());
      }
    } else {
      console.log("🚀 ~ signUp ~ error:", error);
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
    const data: SignUpResponse = await instance.post("/it4788/signup", signUpData);

    console.log(data);
    console.log(data.status_code);

    return data;
  } catch (error: any) {
    // Kiểm tra nếu có lỗi với response và có data từ server
    if (error.response && error.response.data) {
      const data = error.response.data as SignUpResponse;

      if (data.status_code === 9996) {
        console.log("Đăng ký thất bại (User existed):", data);
        return data;
      } else {
        console.error("Đăng ký thất bại với mã lỗi khác:", data.message);
        throw new Error(data.message);
      }
    } else {
      console.log("🚀 ~ signUp ~ error:", error);
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

export async function CheckVerifyCode(checkVerifyCodeData: CheckVerifyCodeRequest) {
  try {
    const data: CheckVerifyCodeResponse = await instance.post("/it4788/check_verify_code", checkVerifyCodeData);

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
      if (status_code === "1004") {
        console.error("Mã xác thực không hợp lệ hoặc email không khớp:", message);
        throw new Error("Mã xác thực không hợp lệ.");
      } else if (status_code === "1010") {
        console.error("Email đã được xác thực trước đó:", message);
        throw new Error("Email đã được xác thực trước đó.");
      } else {
        console.error("Lỗi khác từ server:", message);
        throw new Error(message);
      }
    } else {
      console.log("🚀 ~ CheckVerifyCode ~ error:", error);
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
    const data: ResendVerifyCodeResponse = await instance.post('/it4788/get_verify_code', { email });
    console.log('ResendVerifyCode success:', data);
    return data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const errorData = error.response.data as string;
      const [status_code, message] = errorData.split(' | ');
      if (status_code === "1010") {
        throw new Error("Email đã được xác thực từ trước.");
      } else if (status_code === "1009") {
        throw new Error("Yêu cầu quá thường xuyên. Vui lòng thử lại sau.");
      }
    } else {
      console.log('🚀 ~ resendVerifyCode ~ error:', error);
      throw error;
    }
  }
}