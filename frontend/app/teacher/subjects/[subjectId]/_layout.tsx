// app/teacher/_layout.tsx
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="questions" options={{ headerShown: false }} />
    </Stack>
  );
}
