// app/teacher/_layout.tsx
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
    </Stack>
  );
}
