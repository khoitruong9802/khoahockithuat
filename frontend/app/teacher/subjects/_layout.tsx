// app/teacher/_layout.tsx
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[subjectId]" options={{ headerShown: false }} />
    </Stack>
  );
}
