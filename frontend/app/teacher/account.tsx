import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAppStore } from "@/store";
import { useLoadingStore } from "@/store/loadingSlice";

export default function AccountScreen() {
  const router = useRouter();
  const { setLoading } = useLoadingStore();
  const user = useAppStore((state) => state.user);
  const clearUser = useAppStore((state) => state.clearUser);

  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [setLoading, user]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      clearUser();
      setLoading(false);
      router.replace("/login");
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại.");
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không có thông tin người dùng.</Text>
        <Button
          title="Quay lại đăng nhập"
          onPress={() => router.replace("/login")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin tài khoản</Text>

      {userData ? (
        <View style={styles.infoBox}>
          <Text style={styles.label}>
            Email: <Text style={styles.value}>{userData.email}</Text>
          </Text>
          <Text style={styles.label}>
            Họ tên:{" "}
            <Text style={styles.value}>
              {userData.fullname || "Chưa cập nhật"}
            </Text>
          </Text>
          <Text style={styles.label}>
            Vai trò:{" "}
            <Text style={styles.value}>
              {userData.role === "teacher" ? "Giáo viên" : "Học sinh"}
            </Text>
          </Text>
          {userData.role === "student" && (
            <Text style={styles.label}>
              Khối: <Text style={styles.value}>{userData.grade}</Text>
            </Text>
          )}
        </View>
      ) : (
        <Text style={{ marginTop: 10 }}>Đang tải thông tin...</Text>
      )}

      <View style={styles.logoutContainer}>
        <Button title="Đăng xuất" onPress={handleLogout} color="#d9534f" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  value: {
    fontWeight: "normal",
  },
  logoutContainer: {
    width: "60%",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
});
