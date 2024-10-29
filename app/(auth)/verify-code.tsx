import React, { useState } from "react";
import { View, Image, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const verifyCodeScreen: React.FC = () => {
  const [code, setCode] = useState<string>("");

  return (
    <View style={styles.container}>
      {/*<Image source={require("../../assets/images/icon.png")} style={styles.logo} />*/}

      <Text style={styles.title}>Nhập mã từ email của bạn</Text>

      <Text>Nhập mã xác thực được gửi đến truong.nv215496@sis.hust.edu.vn</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập mã xác thực"
        placeholderTextColor="#d3d3d3"
        value={code}
        onChangeText={setCode}
      />

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Xác nhận</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
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
    color: "#000000",
    marginBottom: 100,
    textAlign: "center",
  },
  para: {
    fontSize: 16,
    color: "#1A1A1A",
    marginBottom: 40,
    textAlign: "center",
    justifyContent:"center"
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
  picker: {
    color: "#d3d3d3",
    width: "100%",
    height: 70,
    backgroundColor: "#a2131b",
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 32,
    justifyContent: "center",
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
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
});

export default verifyCodeScreen;
