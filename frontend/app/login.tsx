import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { useAppStore } from "../store";
import { Link, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useLoadingStore } from "@/store/loadingSlice";
import { Image } from "expo-image";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const setUser = useAppStore((state) => state.setUser);
  const router = useRouter();
  const { setLoading } = useLoadingStore();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.data()?.role;

      setUser(user, role);
      setErrorMessage("");

      setLoading(false);
      if (role === "teacher") {
        router.replace("/teacher");
      } else {
        router.replace("/student");
      }
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/invalid-email") {
        setErrorMessage("Định dạng email không phù hợp");
      } else if (error.code === "auth/invalid-credential") {
        setErrorMessage("Thông tin đăng nhập không chính xác");
      } else if (error.code === "auth/missing-password") {
        setErrorMessage("Vui lòng nhập mật khẩu");
      } else {
        setErrorMessage("Hệ thống lỗi, vui lòng thử lại sau");
      }
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/login-logo.png")}
        style={styles.logo}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Nhập email"
        keyboardType="email-address"
      />

      {/* Password */}
      <Text style={styles.label}>Mật khẩu</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Nhập mật khẩu"
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <Button title="Đăng nhập" onPress={handleLogin} />
      </View>

      <Link style={styles.link} href={"/signup"}>
        Tạo tài khoản mới
      </Link>

      {/* Error Message */}
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  link: {
    color: "#007bff",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    marginTop: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
});
