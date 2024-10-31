import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const SignUpScreen: React.FC = () => {
  const [ho, setHo] = useState<string>("");
  const [ten, setTen] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

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
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Tên"
        placeholderTextColor="#d3d3d3"
        value={ten}
        onChangeText={setTen}
        autoCapitalize="words"
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

      <DropDownPicker
        open={open}
        value={role}
        items={[
          { label: "Sinh viên (Student)", value: "student" },
          { label: "Giảng viên (Lecturer)", value: "lecturer" },
        ]}
        setOpen={setOpen}
        setValue={setRole}
        placeholder="Chọn vai trò..."
        placeholderStyle={styles.placeholderStyle}
        textStyle={styles.textStyle}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      <TouchableOpacity onPress={handleSignUp} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>SIGN UP</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.loginWithUsername}>Hoặc đăng nhập với username/password</Text>
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
  dropdown: {
    width: "100%",
    height: 70,
    backgroundColor: "#a2131b",
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 32,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  dropdownContainer: {
    borderColor: "#FFFFFF",
    backgroundColor: "#a2131b",
    borderWidth: 1,
    borderRadius: 16,
  },
  placeholderStyle: {
    color: "#d3d3d3",
  },
  textStyle: {
    color: "#FFFFFF",
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
  loginWithUsername: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 20,
    textDecorationLine: "underline",
  },
});

export default SignUpScreen;
