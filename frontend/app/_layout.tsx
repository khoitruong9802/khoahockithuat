// app/_layout.tsx
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAppStore } from "../store";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import GlobalLoading from "@/components/global-loading";
// import { useColorScheme } from "@/hooks/use-color-scheme";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  const { setUser } = useAppStore();
  // const colorScheme = useColorScheme();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          const role = data.role || null;
          const grade = data.grade || null; // ✅ get grade from Firestore

          setUser(firebaseUser, role, grade); // pass grade to your store
        }
      } else {
        setUser(null, null, null);
      }

      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="student" options={{ headerShown: false }} />
          <Stack.Screen name="teacher" options={{ headerShown: false }} />
        </Stack>
        <GlobalLoading />
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000", // optional: set your global background
  },
});
