import { ROLES } from '@/constants/role';
import { signIn } from '@/services/api-calls/auth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const SignInScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  // Kiểm tra định dạng email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Kiểm tra mật khẩu hợp lệ (ít nhất 6 ký tự, nhiều nhất 10 ký tự, không trùng với email)
  const isValidPassword = (email: string, password: string): boolean => {
    return password.length >= 6 && password.length <= 10 && email !== password;
  };

  // Xử lý nhấn nút đăng nhập
  const handleLogin = async () => {
    try {
      let valid = true;
  
      // Reset lỗi trước khi kiểm tra
      setEmailError('');
      setPasswordError('');
  
      // Kiểm tra email
      if (!email) {
        setEmailError('Vui lòng nhập email');
        valid = false;
      } else if (!isValidEmail(email)) {
        setEmailError('Email sai định dạng');
        valid = false;
      }
  
      // Kiểm tra mật khẩu
      if (!password) {
        setPasswordError('Vui lòng nhập mật khẩu');
        valid = false;
      } else if (!isValidPassword(email, password)) {
        setPasswordError('Mật khẩu sai định dạng');
        valid = false;
      }
  
      // Nếu hợp lệ, tiếp tục đăng nhập
      if (valid) {
        const profile = await signIn(email,password)
        if(profile.role == ROLES.STUDENT) router.push('/student');
        else router.push('/lecturer')
      }
    } catch (error: any) {
      console.log("🚀 ~ handleLogin ~ error:", error?.status)
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../../assets/images/icon.png')} style={styles.logo}/>

      <Text style={styles.title}>Đăng nhập bằng tài khoản QLDT</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#d3d3d3"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {/* Hiển thị lỗi email */}
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor="#d3d3d3"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      {/* Hiển thị lỗi mật khẩu */}
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9b0504',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 70,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 32,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
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
  forgotPasswordText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default SignInScreen;
