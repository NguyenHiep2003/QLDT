import { TProfile } from "@/types/profile";
import instance from "./axios";
import { saveProfileLocal } from "../storages/profile";
import { saveTokenLocal } from "../storages/token";

type ErrorResponse = {
  code: number;
  message: string;
};

type SignInResponse = {
  data: {
    id: number;
    ho: string;
    ten: string;
    token: string;
    user_name: string;
    active: string;
    role: string;
    class_list: any[];
    avatar: string;
  };
};

export async function signIn(email: string, password: string) {
  try {
    const response: SignInResponse = await instance.post("/it4788/login", {
      email,
      password,
      deviceId: 1,
    });
    const { ho, ten, id, user_name, active, role, class_list, avatar } = response.data;
    const profile: TProfile = {
      id,
      ho,
      ten,
      user_name,
      active,
      role,
      class_list,
      avatar,
    };
    await saveProfileLocal(profile);
    await saveTokenLocal(response.data.token);
    console.log("Login successfully!");
    return response.data;

  } catch (error: any) {
    const errorResponse: ErrorResponse = error.rawError;
    const { code, message } = errorResponse;

    if (code === 1016) {
      error.setTitle("Sai thông tin đăng nhập");
      error.setContent("Email chưa được đăng ký trước đó");
    } else if (code === 1017) {
      error.setTitle("Sai thông tin đăng nhập");
      error.setContent("Mật khẩu không chính xác");
    }

    throw error;
  }
}


type SignUpResponse = {
  code: number;
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
    console.log("Sign up successfully, verify now!");
    return data;

  } catch (error: any) {
    const errorResponse: ErrorResponse = error.rawError;
    const { code, message } = errorResponse;

    if (code === 9996) {
      error.setTitle("Email đã được đăng ký từ trước");
      error.setContent("Vui lòng nhập một Email khác");
    }

    throw error;
  }
}


type CheckVerifyCodeResponse = {
  code: number;
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
    console.log("Verify successfully!");
    return data;

  } catch (error: any) {
    const errorResponse: ErrorResponse = error.rawError;
    const { code, message } = errorResponse;

    if (code === 1016) {
      error.setTitle("Lỗi xác thực");
      error.setContent("Email đã được xác thực trước đó");
    } else if (code === 9990) {
      error.setTitle("Lỗi email xác thực");
      error.setContent("Email chưa được đăng ký trước đó");
    } else if (code === 9993) {
      error.setTitle("Lỗi mã xác thực");
      error.setContent("Mã xác thực không hợp lệ");
    }

    throw error;
  }
}

type ResendVerifyCodeResponse = {
  code: number;
  message: string;
  verify_code: string;
};

export async function resendVerifyCode(email: string, password: string) {
  try {
    const data: ResendVerifyCodeResponse = await instance.post("/it4788/get_verify_code", { email, password });
    console.log("ResendVerifyCode success:", data);
    return data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.rawError;
    const { code, message } = errorResponse;

    if (code === 1019) {
      error.setTitle("Lỗi xác thực");
      error.setContent("Email đã được xác thực trước đó");
    } else if (code === 1020) {
      error.setTitle("Lỗi gửi mã");
      error.setContent("Yêu cầu quá thường xuyên. Vui lòng thử lại sau");
    } else if (code === 9990) {
      error.setTitle("Lỗi xác thực");
      error.setContent("Email chưa được đăng ký trước đó");
    }

    throw error;
  }
}


type ChangePasswordRequest = {
  old_password: string;
  new_password: string;
};

type ChangePasswordResponse = {
  code: number;
  message: string;
};

export async function changePassword(changePassWordRequest: ChangePasswordRequest) {
  try {
    const data: ChangePasswordResponse = await instance.post("/it4788/change_password", changePassWordRequest);
    console.log(data);
    return data;
  } catch (error: any) {
    const errorResponse: ErrorResponse = error.rawError;
    const { code, message } = errorResponse;

    if (code === 1017) {
      error.setTitle("Mật khẩu không chính xác");
      error.setContent("Mật khẩu cũ không đúng");
    } else if (code === 1018) {
      error.setTitle("Mật khẩu mới gần giống mật khẩu cũ");
      error.setContent("Vui lòng chọn mật khẩu mới khác");
    }

    throw error;
  }
}
