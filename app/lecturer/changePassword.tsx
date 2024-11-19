import { changePassword } from "@/services/api-calls/auth";
import { useErrorContext } from "@/utils/ctx";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { GeneralErrorDialog } from "@/components/GeneralErrorDialog";

const ChangePasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const { setUnhandledError } = useErrorContext(); // Dialog báo lỗi
  const [errorDialog, setErrorDialog] = useState({
    isVisible: false,
    title: "",
    content: "",
    onClickPositiveBtn: () => {},
  });

  // Kiểm tra độ dài mật khẩu
  const isPasswordLengthValid = (password: string): boolean => {
    return password.length >= 6 && password.length <= 10;
  };

  // Kiểm tra mật khẩu không chứa ký tự đặc biệt
  const hasNoSpecialCharacters = (password: string): boolean => {
    const noSpecialCharRegex = /^[a-zA-Z0-9]*$/;
    return noSpecialCharRegex.test(password);
  };

  const [passwordError, setPasswordError] = useState<string>("");
  const [newPasswordError, setNewPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const validateInputs = (): boolean => {
    setPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");

    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu");
      return false;
    }
    if (!newPassword) {
      setNewPasswordError("Vui lòng nhập mật khẩu mới");
      return false;
    }
    if (!confirmPassword) {
      setPasswordError("Vui lòng xác nhận mật khẩu mới");
      return false;
    }

    if (!isPasswordLengthValid(password) || !hasNoSpecialCharacters(password)) {
      setPasswordError("Mật khẩu cũ sai định dạng");
      return false;
    }
    if (!isPasswordLengthValid(newPassword)) {
      setNewPasswordError("Mật khẩu mới phải có từ 6 đến 10 ký tự");
      return false;
    }
    if (!hasNoSpecialCharacters(newPassword)) {
      setNewPasswordError("Mật khẩu mới không được chứa ký tự đặc biệt");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Mật khẩu không khớp");
      return false;
    }

    return true;
  };

  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  const handleChangePassword = async () => {
    if (isChangingPassword) return;

    setPassword(password.trim());
    setNewPassword(newPassword.trim());
    setConfirmPassword(confirmPassword.trim());

    if (!validateInputs()) return;

    setIsChangingPassword(true);
    try {
      const requestBody = {
        old_password: password,
        new_password: newPassword,
      };

      const response = await changePassword(requestBody);
      console.log("data:", response);

      setErrorDialog({
        isVisible: true,
        title: "Thành công",
        content: "Đổi mật khẩu thành công!",
        onClickPositiveBtn: () => {
          setErrorDialog((prev) => ({ ...prev, isVisible: false }));
          router.back();
        },
      });

    } catch (error: any) {
      setUnhandledError(error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* <Text style={styles.title}>Đổi mật khẩu</Text> */}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputText}
          placeholder="Mật khẩu cũ"
          placeholderTextColor="#d3d3d3"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
          <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={24} color="#d3d3d3" />
        </TouchableOpacity>
      </View>
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputText}
          placeholder="Mật khẩu mới"
          placeholderTextColor="#d3d3d3"
          value={newPassword}
          onChangeText={setNewPassword}
          autoCapitalize="none"
          secureTextEntry={!isNewPasswordVisible}
        />
        <TouchableOpacity onPress={() => setNewPasswordVisible(!isNewPasswordVisible)}>
          <Ionicons name={isNewPasswordVisible ? "eye" : "eye-off"} size={24} color="#d3d3d3" />
        </TouchableOpacity>
      </View>
      {newPasswordError ? <Text style={styles.errorText}>{newPasswordError}</Text> : null}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputText}
          placeholder="Xác nhận mật khẩu mới"
          placeholderTextColor="#d3d3d3"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoCapitalize="none"
          secureTextEntry={!isConfirmPasswordVisible}
        />
        <TouchableOpacity onPress={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)}>
          <Ionicons name={isConfirmPasswordVisible ? "eye" : "eye-off"} size={24} color="#d3d3d3" />
        </TouchableOpacity>
      </View>
      {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

      <TouchableOpacity
        onPress={handleChangePassword}
        disabled={isChangingPassword}
        style={[styles.button, isChangingPassword && styles.disabledButton]}
      >
        {isChangingPassword ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Xác nhận đặt lại mật khẩu</Text>
        )}
      </TouchableOpacity>

      <GeneralErrorDialog {...errorDialog} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
    paddingBottom: 8,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#ff4d4f",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 15,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default ChangePasswordScreen;
