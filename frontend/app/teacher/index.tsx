import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function TeacherHomeScreen() {
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Welcome, Teacher!
      </Text>

      <View style={{ marginVertical: 10 }}>
        <Button
          title="Manage Subjects"
          onPress={() => router.push("/teacher/subjects")}
        />
      </View>

      <View style={{ marginVertical: 10 }}>
        <Button
          title="View Test Results"
          onPress={() => router.push("/teacher/results")}
        />
      </View>
    </View>
  );
}
