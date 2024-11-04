import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Modal } from "react-native";

const SignInScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [isForgotPasswordVisible, setForgotPasswordVisible] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [forgotEmailError, setForgotEmailError] = useState<string>("");

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (email: string, password: string): boolean => {
    return password.length >= 6 && password.length <= 10 && email !== password;
  };

  const handleLogin = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Vui lòng nhập email");
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("Email sai định dạng");
      valid = false;
    }

    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu");
      valid = false;
    } else if (!isValidPassword(email, password)) {
      setPasswordError("Mật khẩu sai định dạng");
      valid = false;
    }

    if (valid) {
      console.log("Thông tin hợp lệ, tiếp tục đăng nhập...");
    }
  };

  const handleForgotPasswordSubmit = () => {
    setForgotEmailError("");

    if (!forgotEmail) {
      setForgotEmailError("Vui lòng nhập email đã đăng ký");
    } else if (!isValidEmail(forgotEmail)) {
      setForgotEmailError("Email sai định dạng");
    } else {
      console.log("Yêu cầu đặt lại mật khẩu đã được gửi");
      setForgotPasswordVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/icon.png")} style={styles.logo} />
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
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor="#d3d3d3"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setForgotPasswordVisible(true)}>
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

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
            {forgotEmailError ? <Text style={styles.errorText}>{forgotEmailError}</Text> : null}

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={handleForgotPasswordSubmit} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Gửi yêu cầu</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setForgotPasswordVisible(false)} style={styles.cancelButton}>
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9b0504",
    alignItems: "center",
    justifyContent: "center",
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
    color: "#FFFFFF",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 70,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 32,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  errorText: {
    color: "#FFC107",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "left",
    width: "100%",
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#C8102E",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPasswordText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 20,
    textDecorationLine: "underline",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  forgotEmailInput: {
    width: "100%",
    height: 50,
    borderColor: "#1d1d1d",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#000000",
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
    color: "#FFFFFF",
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
    color: "#9b0504",
    fontSize: 16,
  },
});

export default SignInScreen;
