import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { signUp } from "@/services/api-calls/auth";
import { useErrorContext } from "@/utils/ctx";

const SignUpScreen: React.FC = () => {
  const [ho, setHo] = useState<string>("");
  const [ten, setTen] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");

  const hoInputRef = useRef<TextInput>(null);

  useEffect(() => {
    hoInputRef.current?.focus(); // Tự động focus vào ô "Họ" khi vào màn hình
  }, []);

  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [roleError, setRoleError] = useState<string>("");
  const { setUnhandledError } = useErrorContext(); // Dialog báo lỗi

  //Kiểm tra định dạng Email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  //Kiểm tra email có đuôi @hust.edu.vn hay không
  const isValidDomainRegex = (email: string): boolean => {
    const validDomainRegex = /@(hust\.edu\.vn|soict\.hust\.edu\.vn)$/;
    return validDomainRegex.test(email);
  };

  // Kiểm tra độ dài mật khẩu
  const isPasswordLengthValid = (password: string): boolean => {
    return password.length >= 6 && password.length <= 10;
  };

  // Kiểm tra mật khẩu khác email
  const isPasswordDifferentFromEmail = (email: string, password: string): boolean => {
    return email !== password;
  };

  // Kiểm tra mật khẩu không chứa ký tự đặc biệt
  const hasNoSpecialCharacters = (password: string): boolean => {
    const noSpecialCharRegex = /^[a-zA-Z0-9]*$/;
    return noSpecialCharRegex.test(password);
  };


  //Kiểm tra đầu vào trước khi gửi request đến server
  const validateInputs = (): boolean => {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setRoleError("");

    //Kiểm tra Họ Tên
    if (!ho || !ten) {
      setNameError("Vui lòng không bỏ trống Họ và Tên");
      return false;
    }

    //Kiểm tra email
    if (!email) {
      setEmailError("Vui lòng nhập email");
      return false;
    }
    if (!isValidEmail(email)) {
      setEmailError("Email sai định dạng");
      return false;
    }
    if (!isValidDomainRegex(email)) {
      setEmailError("Email phải có đuôi miền là @hust.edu.vn hoặc @soict.hust.edu.vn");
      return false;
    }

    //Kiểm tra mật khẩu
    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu");
      return false;
    }
    if (!isPasswordLengthValid(password)) {
      setPasswordError("Mật khẩu phải có từ 6 đến 10 ký tự");
      return false;
    }
    if (!isPasswordDifferentFromEmail(email, password)) {
      setPasswordError("Mật khẩu phải khác email");
      return false;
    }
    if (!hasNoSpecialCharacters(password)) {
      setPasswordError("Mật khẩu không được chứa ký tự đặc biệt");
      return false;
    }

    //Kiểm tra role
    if (!role) {
      setRoleError("Vui lòng chọn vai trò");
      return false;
    }

    //Nếu đúng định dạng
    return true;
  };

  //Trạng thái đang đăng ký
  const [isSigningIn, setIsSigningIn] = useState(false);

  //Hàm xử lý người dùng ấn Đăng ký
  const handleSignUp = async () => {
    if (isSigningIn) return;

    // Xóa bỏ khoảng trắng thừa ở đầu và cuối chuỗi
    setHo(ho.trim());
    setTen(ten.trim());
    setEmail(email.trim());
    setPassword(password.trim());

    if (!validateInputs()) return;

    setIsSigningIn(true);

    try {
      const requestBody = {
        ho: ho,
        ten: ten,
        email: email,
        password: password,
        uuid: 11111,
        role: role,
      };

      const response = await signUp(requestBody);
      console.log("Mã xác minh:", response.verify_code);
      router.push({ pathname: "/(auth)/verify-code", params: { email, password } });

    } catch (error: any) {
      setUnhandledError(error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.logoContainer}>
        <Image source={require("../../assets/images/icon_hust.png")} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Welcome to AllHust</Text>
      </View>

      <View style={styles.nameContainer}>
        <View style={[styles.inputContainer, styles.hoInput]}>
          <TextInput
            ref={hoInputRef}
            style={[styles.inputText]}
            placeholder="Họ"
            placeholderTextColor="#d3d3d3"
            value={ho}
            onChangeText={setHo}
            autoCapitalize="words"
          />
        </View>

        <View style={[styles.inputContainer, styles.tenInput]}>
          <TextInput
            style={[styles.inputText]}
            placeholder="Tên"
            placeholderTextColor="#d3d3d3"
            value={ten}
            onChangeText={setTen}
            autoCapitalize="words"
          />
        </View>
      </View>
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

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
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputText}
          placeholder="Mật khẩu"
          placeholderTextColor="#d3d3d3"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry={!isPasswordVisible} // Toggle secureTextEntry
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
          <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={24} color="#d3d3d3" />
        </TouchableOpacity>
      </View>
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={{
            color: role ? "#FFFFFF" : "#d3d3d3",
          }}
        >
          <Picker.Item label="Chọn vai trò..." value="" color="#5d5d5d" style={{ fontSize: 16 }} />
          <Picker.Item label="Sinh viên (Student)" value="STUDENT" color="#000000" style={{ fontSize: 16 }} />
          <Picker.Item label="Giảng viên (Lecturer)" value="LECTURER" color="#000000" style={{ fontSize: 16 }} />
        </Picker>
      </View>
      {roleError ? <Text style={styles.errorText}>{roleError}</Text> : null}

      <View style={styles.footerContainer}>
        <TouchableOpacity
          onPress={handleSignUp}
          disabled={isSigningIn}
          style={[styles.signUpButton, isSigningIn && styles.disabledButton]}
        >
          {isSigningIn ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.signUpButtonText}>SIGN UP</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.loginWithUsername}>Hoặc đăng nhập với username/password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#a2131b",
    padding: 30,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: "100%",
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    color: "#FFFFFF",
    marginBottom: 40,
    textAlign: "center",
  },
  nameContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  hoInput: {
    flex: 1,
    marginRight: 10,
  },
  tenInput: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 60,
    backgroundColor: "#a2131b",
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 32,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    height: "100%",
  },
  errorText: {
    color: "#FFC107",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "left",
    width: "100%",
  },
  /*dropdown: {
    width: "100%",
    height: 60,
    backgroundColor: "#a2131b",
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 32,
    paddingHorizontal: 15,
  },*/
  dropdownContainer: {
    borderColor: "#FFFFFF",
    backgroundColor: "#a2131b",
    borderWidth: 1,
    borderRadius: 32,
    marginBottom: 20,
    height: 60,
    width: "100%",
  },
  placeholderStyle: {
    color: "#d3d3d3",
  },
  textStyle: {
    color: "FFFFFF",
    fontSize: 16,
  },
  footerContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  signUpButton: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  signUpButtonText: {
    color: "#C8102E",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginWithUsername: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 30,
    textDecorationLine: "underline",
    textAlign: "center",
  },
  dropdownPicker: {
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 16,
  },
});

export default SignUpScreen;
