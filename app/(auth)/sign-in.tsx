import { ROLES } from '@/constants/Roles';
import { signIn } from '@/services/api-calls/auth';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Modal,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useErrorContext } from '@/utils/ctx';
import { ForbiddenException } from '@/utils/exception';

const SignInScreen: React.FC = () => {
    const { email: passedEmail } = useLocalSearchParams<{ email?: string }>();

    const [email, setEmail] = useState<string>(passedEmail || '');
    const [password, setPassword] = useState<string>('');
    const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isForgotPasswordVisible, setForgotPasswordVisible] =
        useState<boolean>(false);
    const [forgotEmail, setForgotEmail] = useState<string>('');
    const [forgotEmailError, setForgotEmailError] = useState<string>('');
    const { setUnhandledError } = useErrorContext(); // Dialog báo lỗi
    const passwordInputRef = useRef<TextInput>(null); // Tạo ref cho ô nhập mật khẩu
    // Nếu có email từ tham số, focus vào ô mật khẩu
    useEffect(() => {
        if (passedEmail) {
            passwordInputRef.current?.focus();
        }
    }, [passedEmail]);

    //Kiểm tra định dạng Email
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validDomainRegex = /@(hust\.edu\.vn|soict\.hust\.edu\.vn)$/;
        return emailRegex.test(email) && validDomainRegex.test(email);
    };

    //Kiểm tra định dạng mật khẩu
    const isValidPassword = (email: string, password: string): boolean => {
        const noSpecialCharRegex = /^[a-zA-Z0-9]*$/;
        return (
            password.length >= 6 &&
            password.length <= 10 &&
            email !== password &&
            noSpecialCharRegex.test(password)
        );
    };


    //Kiểm tra đầu vào trước khi gửi request đến server
    const validateInputs = (): boolean => {
        setEmailError('');
        setPasswordError('');

        //Kiểm tra email
        if (!email) {
            setEmailError('Vui lòng nhập email');
            return false;
        }
        if (!isValidEmail(email)) {
            setEmailError('Email sai định dạng');
            return false;
        }

        //Kiểm tra mật khẩu
        if (!password) {
            setPasswordError('Vui lòng nhập mật khẩu');
            return false;
        }
        if (!isValidPassword(email, password)) {
            setPasswordError('Mật khẩu sai định dạng');
            return false;
        }

        //Nếu đúng định dạng
        return true;
    };


    //Hàm xử lý người dùng ấn Đăng nhập
    const handleLogin = async () => {
        if (isLoggingIn) return;

        // Xóa bỏ khoảng trắng thừa ở đầu và cuối chuỗi
        setEmail(email.trim());
        setPassword(password.trim());

        if (!validateInputs()) return;

        setIsLoggingIn(true);

        try {
            const profile = await signIn(email, password);

            if (profile?.role === ROLES.STUDENT) {
                router.replace('/student');
            } else if (profile?.role === ROLES.LECTURER) {
                router.replace('/lecturer');
            } 
        } catch (error: any) {
            if (error instanceof ForbiddenException) {
                return router.push({ pathname: "/(auth)/verify-code", params: { email, password, fromSignIn: "true"} });
            }
            setUnhandledError(error);
        } finally {
            setIsLoggingIn(false);
        }
    };


    //Hàm xử lý quên mật khẩu
    const handleForgotPasswordSubmit = () => {
        setForgotEmailError('');

        if (!forgotEmail) {
            setForgotEmailError('Vui lòng nhập email đã đăng ký');
        } else if (!isValidEmail(forgotEmail)) {
            setForgotEmailError('Email sai định dạng');
        } else {
            console.log('Yêu cầu đặt lại mật khẩu đã được gửi');
            setForgotPasswordVisible(false);
            Alert.alert('Thông báo!', 'Chức năng hiện chưa phát triển!');
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/images/icon.png')}
                    style={styles.logo}
                />
                <Text style={styles.title}>Đăng nhập bằng tài khoản QLDT</Text>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputText}
                        placeholder="Email"
                        placeholderTextColor="#d3d3d3"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                {emailError ? (
                    <Text style={styles.errorText}>{emailError}</Text>
                ) : null}

                <View style={styles.inputContainer}>
                    <TextInput
                        ref={passwordInputRef} // Ref cho input mật khẩu
                        style={styles.inputText}
                        placeholder="Mật khẩu"
                        placeholderTextColor="#d3d3d3"
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        secureTextEntry={!isPasswordVisible} // Toggle secureTextEntry
                    />
                    <TouchableOpacity
                        onPress={() => setPasswordVisible(!isPasswordVisible)}
                    >
                        <Ionicons
                            name={isPasswordVisible ? 'eye' : 'eye-off'}
                            size={24}
                            color="#d3d3d3"
                        />
                    </TouchableOpacity>
                </View>
                {passwordError ? (
                    <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}

                <TouchableOpacity
                    onPress={handleLogin}
                    disabled={isLoggingIn}
                    style={[
                        styles.loginButton,
                        isLoggingIn && styles.disabledButton,
                    ]}
                >
                    {isLoggingIn ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.loginButtonText}>Đăng nhập</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setForgotPasswordVisible(true)}
                >
                    <Text style={styles.forgotPasswordText}>
                        Quên mật khẩu?
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal
                transparent={true}
                visible={isForgotPasswordVisible}
                animationType="slide"
                onRequestClose={() => setForgotPasswordVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text
                            style={styles.modalTitle}
                        >{`Bạn hãy nhập Email (của trường) hoặc MSSV (đối với Sinh viên) để lấy lại mật khẩu. Mật khẩu mới sẽ được gửi về email của bạn`}</Text>
                        <TextInput
                            style={styles.forgotEmailInput}
                            placeholder="Email hoặc mã số Sinh viên"
                            placeholderTextColor="#d3d3d3"
                            value={forgotEmail}
                            onChangeText={setForgotEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {forgotEmailError ? (
                            <Text style={styles.errorText}>
                                {forgotEmailError}
                            </Text>
                        ) : null}

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                onPress={handleForgotPasswordSubmit}
                                style={styles.modalButton}
                            >
                                <Text style={styles.modalButtonText}>
                                    Gửi yêu cầu
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setForgotPasswordVisible(false)}
                                style={styles.cancelButton}
                            >
                                <Text style={styles.modalCancelText}>Hủy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.footerContainer}>
                <TouchableOpacity
                    onPress={() => router.push('/(auth)/sign-up')}
                    style={styles.signUpButton}
                >
                    <Text style={styles.signUpButtonText}>
                        Tạo tài khoản mới
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#9b0504',
        paddingHorizontal: 30,
        paddingTop: 60,
        paddingBottom: 40,
        justifyContent: 'space-between',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 20,
    },
    title: {
        fontSize: 24,
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 10,
    },
    formContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 60,
        backgroundColor: '#9b0504',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 32,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    inputText: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
        height: '100%',
    },
    errorText: {
        color: '#FFC107',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'left',
        width: '100%',
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    loginButtonText: {
        color: '#C8102E',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.6,
    },
    forgotPasswordText: {
        color: '#FFFFFF',
        fontSize: 14,
        marginTop: 20,
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    forgotEmailInput: {
        width: '100%',
        height: 50,
        borderColor: '#9b0504',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#000000',
        marginBottom: 20,
    },
    modalButton: {
        flex: 1,
        backgroundColor: '#9b0504',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 10,
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#9b0504',
    },
    modalCancelText: {
        color: '#9b0504',
        fontSize: 16,
    },
    footerContainer: {
        alignItems: 'center',
        marginTop: 30,
    },
    signUpButton: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    signUpButtonText: {
        color: '#C8102E',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SignInScreen;
