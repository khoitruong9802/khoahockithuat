import { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { Link, useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { Image } from "expo-image";
import { useLoadingStore } from "@/store/loadingSlice";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [role, setRole] = useState<"teacher" | "student">("student");
  const [grade, setGrade] = useState<"10" | "11" | "12">("10");
  const router = useRouter();
  const { setLoading } = useLoadingStore();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        fullname,
        role,
        grade: role === "teacher" ? null : grade,
      });

      setLoading(false);
      router.replace("/login");
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/invalid-email") {
        setErrorMessage("Invalid email format.");
      } else if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Email is already in use.");
      } else if (error.code === "auth/weak-password") {
        setErrorMessage("Password should be at least 6 characters.");
      } else {
        setErrorMessage("Signup failed. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/login-logo.png")}
          style={styles.logo}
        />

        <Text style={styles.label}>Họ và tên</Text>
        <TextInput
          style={styles.input}
          value={fullname}
          onChangeText={setFullname}
          placeholder="Nhập họ và tên"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Nhập email"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Nhập mật khẩu"
          secureTextEntry
        />

        <Text style={styles.label}>Xác nhận mật khẩu</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Nhập lại mật khẩu"
          secureTextEntry
        />

        <Text style={styles.label}>Vai trò</Text>
        <View style={styles.radioGroup}>
          {["teacher", "student"].map((r) => (
            <Pressable
              key={r}
              style={styles.radioOption}
              onPress={() => setRole(r as "teacher" | "student")}
            >
              <View style={styles.radioCircle}>
                {role === r && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioLabel}>
                {r === "teacher" ? "Giáo viên" : "Học sinh"}
              </Text>
            </Pressable>
          ))}
        </View>

        {role === "student" && (
          <>
            <Text style={styles.label}>Khối lớp</Text>
            <View style={styles.radioGroup}>
              {["10", "11", "12"].map((g) => (
                <Pressable
                  key={g}
                  style={styles.radioOption}
                  onPress={() => setGrade(g as "10" | "11" | "12")}
                >
                  <View style={styles.radioCircle}>
                    {grade === g && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.radioLabel}>Lớp {g}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        <View style={styles.buttonContainer}>
          <Button title="Đăng kí" onPress={handleSignup} />
        </View>

        <Link style={styles.link} href={"/login"}>
          Trở về trang đăng nhập
        </Link>

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>
    </TouchableWithoutFeedback>
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
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#007bff",
  },
  radioLabel: {
    fontSize: 16,
  },
  buttonContainer: {
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
