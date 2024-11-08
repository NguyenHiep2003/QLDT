import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Modal } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { CheckVerifyCode, resendVerifyCode } from "@/services/api-calls/auth";
import { StackActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import ThumbsUpAnimation from "@/components/ThumbsUpAnimation";

const VerifyCodeScreen: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [codeError, setCodeError] = useState<String>("");

  const { email } = useLocalSearchParams();

  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onBeforeRemove = (e: any) => {
        if (e.data.action.type === "GO_BACK" || e.data.action.type === "POP") {
          e.preventDefault(); // Ngăn chặn hành động quay lại của người dùng
          setModalVisible(true); // Hiển thị modal khi người dùng nhấn nút Back
        }
      };

      navigation.addListener("beforeRemove", onBeforeRemove);

      return () => {
        navigation.removeListener("beforeRemove", onBeforeRemove);
      };
    }, [navigation])
  );

  const handleStay = () => {
    setModalVisible(false); // Đóng modal khi chọn "Ở lại"
  };

  const handleConfirmBack = () => {
    setModalVisible(false); // Đóng modal và quay lại màn trước đó
    navigation.dispatch(StackActions.popToTop());
    router.push("/(auth)/sign-up");
  };

  //Hàm hiển thị lỗi (Alert)
  const displayErrorAlert = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const [isChecking, setIsChecking] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckVerifyCode = async () => {
    if (isChecking) return;

    setCode(code.trim());
    
    setCodeError("");

    if (!code) {
      setCodeError("Vui lòng nhập mã xác thực");
      return;
    }

    setIsChecking(true);

    try {
      const requestBody = {
        email: Array.isArray(email) ? email[0] : email,
        verify_code: code,
      };

      const response = await CheckVerifyCode(requestBody);
      console.log("data:", response);

      // Đặt modal về false để không hiển thị lại khi điều hướng
      setModalVisible(false);

      setIsSuccess(true);

      // Thông báo đăng nhập thành công
      setTimeout(() => {
        setIsSuccess(false); // Tắt animation sau vài giây
        Alert.alert("Thành công", "Đăng ký thành công", [], {
          cancelable: true,
        });
        navigation.dispatch(StackActions.popToTop());

        router.replace({
          pathname: "/(auth)/sign-in",
          params: { email: Array.isArray(email) ? email[0] : email },
        });
      }, 3000);

      return;
    } catch (error: any) {
      console.log("Đăng ký thất bại:", error);

      // Kiểm tra loại lỗi và hiển thị thông báo
      if (error.message === "Mã xác thực không hợp lệ.") {
        displayErrorAlert("Lỗi mã xác thực", error.message);
      } else if (error.message === "Email đã được xác thực trước đó.") {
        displayErrorAlert("Lỗi xác thực", error.message);
      } else if (
        error.message === "Network request failed" ||
        error instanceof SyntaxError ||
        error.name === "TypeError"
      ) {
        displayErrorAlert("Lỗi kết nối mạng", "Vui lòng kiểm tra kết nối mạng và thử lại!");
      } else {
        console.error("Có lỗi xảy ra", "Vui lòng thử lại sau ít phút!");
      }
    } finally {
      setIsChecking(false);
    }
  };

  // Resend code state
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState<number>(120);
  const resendIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (resendTimer > 0) {
      resendIntervalRef.current = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            if (resendIntervalRef.current) {
              clearInterval(resendIntervalRef.current);
              resendIntervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (resendIntervalRef.current) {
        clearInterval(resendIntervalRef.current);
      }
    };
  }, [resendTimer]);

  const handleResendCode = async () => {
    if (isResending || resendTimer > 0) return;

    setIsResending(true);

    try {
      const emailValue = Array.isArray(email) ? email[0] : email;
      const response = await resendVerifyCode(emailValue);
      console.log("Resend data:", response);

      // Nếu thành công, bắt đầu đếm ngược
      if (response?.meta?.code === 1000) {
        setResendTimer(120);
        displayErrorAlert("Thành công", "Mã xác thực đã được gửi lại. Vui lòng kiểm tra Email của bạn!");
      }
    } catch (error: any) {
      console.log("Resend code failed:", error.message);
      if (error.message === "Yêu cầu quá thường xuyên. Vui lòng thử lại sau.") {
        displayErrorAlert("Lỗi gửi mã", error.message);
      } else if (error.message === "Email đã được xác thực từ trước.") {
        setResendTimer(0);
        displayErrorAlert("Lỗi xác thực", error.message);
      } else {
        setResendTimer(0);
        displayErrorAlert("Không thể gửi mã", "Vui lòng thử lại sau ít phút!");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập mã từ email của bạn</Text>

      <Text style={styles.para}>Nhập mã xác thực được gửi đến {email}</Text>

      <TextInput
        style={styles.inputVerifyCode}
        placeholder="Nhập mã xác thực"
        placeholderTextColor="#d3d3d3"
        value={code}
        onChangeText={setCode}
      />
      {codeError ? <Text style={styles.errorText}>{codeError}</Text> : null}

      <TouchableOpacity
        onPress={handleCheckVerifyCode}
        disabled={isChecking}
        style={[styles.verifyCodeButton, isChecking && styles.disabledButton]}
      >
        {isChecking ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.verifyCodeButtonText}>Xác nhận</Text>}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleResendCode}
        disabled={isResending || resendTimer > 0}
        style={styles.resendButton}
      >
        {isResending || resendTimer > 0 ? (
          <Text style={[styles.resendButtonText, styles.disabledText]}>
            Chờ {resendTimer > 0 ? `(${resendTimer}s)` : ""} để gửi lại mã xác thực
          </Text>
        ) : (
          <Text style={styles.resendButtonText}>Gửi lại mã xác thực</Text>
        )}
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="fade" onRequestClose={handleStay}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận</Text>
            <Text style={styles.modalDescription}>
              Khi quay lại bạn sẽ không thể đăng ký tài khoản bằng email này nữa. Bạn có muốn quay lại không?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.stayButton} onPress={handleStay}>
                <Text style={styles.stayButtonText}>Ở lại</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBack}>
                <Text style={styles.confirmButtonText}>Đồng ý</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {isSuccess && (
        <Modal transparent>
          <View style={styles.modalOverlay}>
            <ThumbsUpAnimation />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 30,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 40,
    textAlign: "center",
  },
  para: {
    fontSize: 16,
    color: "#4A4A4A",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 24,
  },
  inputVerifyCode: {
    width: "100%",
    height: 55,
    borderColor: "#B0C4DE",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#000000",
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
  },
  verifyCodeButton: {
    width: "100%",
    backgroundColor: "#1E90FF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  verifyCodeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  resendButton: {
    paddingVertical: 15,
    alignItems: "center",
  },
  resendButtonText: {
    color: "#1E90FF",
    fontSize: 16,
    textDecorationLine: "underline",
    fontWeight: "400",
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.3,
    textDecorationLine: "none",
    fontSize: 14,
  },
  errorText: {
    color: "#FFC107",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "left",
    width: "100%",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  stayButton: {
    flex: 1,
    backgroundColor: "#ccc",
    borderRadius: 5,
    paddingVertical: 10,
    marginRight: 5,
    alignItems: "center",
  },
  stayButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#d9534f",
    borderRadius: 5,
    paddingVertical: 10,
    marginLeft: 5,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default VerifyCodeScreen;
