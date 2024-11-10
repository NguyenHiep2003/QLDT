import { UnauthorizedDialog } from "@/components/UnauthorizedDialog";
import { changePassword } from "@/services/api-calls/auth";
import { getTokenLocal } from "@/services/storages/token";
import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const ChangePasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const navigation = useNavigation();

  //Hàm hiển thị lỗi (Alert)
  const displayErrorAlert = (title: string, message: string) => {
    Alert.alert(title, message);
  };

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
  const [isDialogVisible, setDialogVisible] = useState(false);

  const handleChangePassword = async () => {
    if (isChangingPassword) return;

    setPassword(password.trim());
    setNewPassword(newPassword.trim());
    setConfirmPassword(confirmPassword.trim());

    if (!validateInputs()) return;

    setIsChangingPassword(true);
    try {
      const token = getTokenLocal().toString();
      const requestBody = {
        token: token,
        old_password: password,
        new_password: newPassword,
      };

      const response = await changePassword(requestBody);
      console.log("data:", response);

      Alert.alert("Thành công", "Đổi mật khẩu thành công", [], {
        cancelable: true,
      });
      router.back();
    } catch (error: any) {
      console.log("Đăng ký thất bại:", error);

      if (error.message === "Token is invalid") {
        displayErrorAlert("Phiên đăng nhập đã hết hạn", "Vui lòng đăng nhập lại");
        setDialogVisible(true);
      } else if (error.message === "Old password is incorrect") {
        displayErrorAlert("Mật khẩu không chính xác", "Mật khẩu cũ không đúng");
      } else if (error.message === "New password is too similar to the old one") {
        displayErrorAlert("Mật khẩu mới gần giống mật khẩu cũ", "Vui lòng chọn mật khẩu mới khác");
      } else {
        console.error("Có lỗi xảy ra", "Vui lòng thử lại sau ít phút!");
        displayErrorAlert("Có lỗi xảy ra", "Vui lòng thử lại sau ít phút!");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Đổi mật khẩu</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Xác nhận đặt lại mật khẩu</Text>
      </TouchableOpacity>

      <UnauthorizedDialog isVisible={isDialogVisible} />
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
});

export default ChangePasswordScreen;
