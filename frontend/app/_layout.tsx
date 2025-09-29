import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/store/useAuthStore";
import GlobalLoading from "@/components/global-loading";
import { useEffect, useState } from "react";

export const unstable_settings = {
  anchor: "(tabs)",
  initialRouteName: "login",
};

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();
  const colorScheme = useColorScheme();
  const router = useRouter();

  // const [isMounted, setIsMounted] = useState(false);

  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  // useEffect(() => {
  //   if (isMounted && !isAuthenticated) {
  //     router.replace("/login");
  //   }
  // }, [router, isMounted, isAuthenticated]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
        <Stack.Screen name="index" options={{ headerShown: true }} />
        <Stack.Screen name="login" options={{ headerShown: true }} />
        <Stack.Screen name="task" options={{ headerShown: true }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <GlobalLoading />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
