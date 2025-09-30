import { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { db } from "../../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAppStore } from "../../../store";
import { useRouter } from "expo-router";

export default function CreateSubjectScreen() {
  const [subjectName, setSubjectName] = useState("");
  const { user } = useAppStore();
  const router = useRouter();

  const handleCreateSubject = async () => {
    if (!subjectName.trim()) {
      Alert.alert("Error", "Subject name cannot be empty");
      return;
    }

    try {
      await addDoc(collection(db, "subjects"), {
        name: subjectName,
        teacherId: user?.uid,
      });

      Alert.alert("Success", "Subject created successfully");
      router.replace("/teacher/subjects"); // 戻る
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create subject");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>Create New Subject</Text>
      <TextInput
        placeholder="Enter subject name"
        value={subjectName}
        onChangeText={setSubjectName}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Button title="Create Subject" onPress={handleCreateSubject} />
    </View>
  );
}
