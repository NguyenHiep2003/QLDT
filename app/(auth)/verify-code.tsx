import React, { useState } from "react";
import { View, Image, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const verifyCodeScreen: React.FC = () => {
  const [code, setCode] = useState<string>("");

  const handleVerifyCode = () => {
    console.log(code);
  }

  return (
    <View style={styles.container}>
      {/*<Image source={require("../../assets/images/icon_hust.png")} style={styles.logo} />*/}

      <Text style={styles.title}>Nhập mã từ email của bạn</Text>

      <Text style={styles.para}>Nhập mã xác thực được gửi đến truong.nv215496@sis.hust.edu.vn</Text>

      <TextInput
        style={styles.inputVerifyCode}
        placeholder="Nhập mã xác thực"
        placeholderTextColor="#d3d3d3"
        value={code}
        onChangeText={setCode}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleVerifyCode}>
        <Text style={styles.loginButtonText}>Xác nhận</Text>
      </TouchableOpacity>

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
  loginButton: {
    width: "100%",
    backgroundColor: "#1E90FF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  forgotPasswordText: {
    color: "#007BFF",
    fontSize: 14,
    marginTop: 20,
    textDecorationLine: "underline",
  },
});

export default verifyCodeScreen;
