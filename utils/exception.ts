import { router } from 'expo-router';

export abstract class CustomException extends Error {
    title = '';
    content = '';
    onClickPositiveBtn = () => {};
    haveBackDropPress = true;
    rawError?: any;

    constructor(message?: string, error?: any) {
        super(message);
        this.rawError = error;
    }

    public getDialogHandlerProps = () => ({
        title: this.title,
        content: this.content,
        onClickPositiveBtn: this.onClickPositiveBtn,
        haveBackDropPress: this.haveBackDropPress,
    });

    public setTitle(title: string) {
        this.title = title;
        return this;
    }
    public setContent(content: string) {
        this.content = content;
        return this;
    }
    public setOnClickPositiveBtn(onClickPositiveBtn: () => void) {
        this.onClickPositiveBtn = onClickPositiveBtn;
        return this;
    }
    public setHaveBackDropPress(haveBackDropPress: boolean) {
        this.haveBackDropPress = haveBackDropPress;
        return this;
    }
}

export class UnauthorizedException extends CustomException {
    title = 'Tài khoản xác thực không thành công';
    content = 'Phiên đăng nhập của bạn đã hết! Vui lòng đăng nhập lại.';
    haveBackDropPress = false;
    onClickPositiveBtn = () => {
        router.navigate('/(auth)/sign-in');
    };
    constructor(error?: any, message?: string) {
        super(message, error);
    }
}

export class InternalServerError extends CustomException {
    title = 'Lỗi hệ thống';
    content = 'Hệ thống đang gặp sự cố! Bạn vui lòng chờ trong ít phút';
    constructor(error?: any, message?: string) {
        super(message, error);
    }
}

export class NetworkError extends CustomException {
    title = 'Lỗi kết nối mạng';
    content =
        'Kết nối Internet không ổn định. Vui lòng kiểm tra và thử lại sau';
    cache: any;
    constructor(error?: any, message?: string) {
        super(message, error);
    }
}

export class ForbiddenException extends CustomException {
    title = 'Không có quyền';
    content = 'Bạn không có quyền thực hiện hành động này';
    constructor(error?: any, message?: string) {
        super(message, error);
    }
}
