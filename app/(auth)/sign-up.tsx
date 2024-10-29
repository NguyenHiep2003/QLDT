import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import đúng thư viện

const SignUpScreen: React.FC = () => {
  const [ho, setHo] = useState<string>("");
  const [ten, setTen] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const handleSignUp = () => {
    console.log("Đăng ký");
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/icon_hust.png")} style={styles.logo} />
      <Text style={styles.title}>Welcome to AllHust</Text>

      <TextInput
        style={styles.input}
        placeholder="Họ"
        placeholderTextColor="#d3d3d3"
        value={ho}
        onChangeText={setHo}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Tên"
        placeholderTextColor="#d3d3d3"
        value={ten}
        onChangeText={setTen}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#d3d3d3"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor="#d3d3d3"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      {/* Dropdown Role with Picker */}
      
        <Picker
          selectedValue={role}
          style={styles.picker}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <Picker.Item label="Chọn vai trò..." value="" color="#d3d3d3" />
          <Picker.Item label="Giảng viên (Lecturer)" value="lecturer" />
          <Picker.Item label="Sinh viên (Student)" value="student" />
        </Picker>
      

      <TouchableOpacity onPress={handleSignUp} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>SIGN UP</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Hoặc đăng nhập với username/password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a2131b",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  logo: {
    width: "100%",
    height: 100,
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

export default SignUpScreen;
