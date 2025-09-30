import { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function CreateQuestionScreen() {
  const { subjectId } = useLocalSearchParams();
  const router = useRouter();

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = async () => {
    if (
      !questionText.trim() ||
      options.some((opt) => !opt.trim()) ||
      correctAnswer === null
    ) {
      Alert.alert(
        "Error",
        "Please fill all fields and select the correct answer"
      );
      return;
    }

    try {
      await addDoc(collection(db, "questions"), {
        subjectId,
        questionText,
        options,
        correctAnswer,
      });

      Alert.alert("Success", "Question created");
      router.replace(`/teacher/subjects/${subjectId}/questions`);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create question");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>Create Question</Text>
      <TextInput
        placeholder="Enter question"
        value={questionText}
        onChangeText={setQuestionText}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      {options.map((opt, index) => (
        <View key={index} style={{ marginBottom: 10 }}>
          <Text>Option {index + 1}</Text>
          <TextInput
            value={opt}
            onChangeText={(text) => handleOptionChange(index, text)}
            style={{ borderWidth: 1, padding: 10 }}
          />
          <Button
            title={
              correctAnswer === index ? "Correct Answer ✅" : "Mark as Correct"
            }
            onPress={() => setCorrectAnswer(index)}
          />
        </View>
      ))}
      <Button title="Create Question" onPress={handleSubmit} />
    </View>
  );
}
