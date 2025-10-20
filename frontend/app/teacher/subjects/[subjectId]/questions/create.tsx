import { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useLoadingStore } from "@/store/loadingSlice";
import { Picker } from "@react-native-picker/picker"; // 🆕 import Picker

export default function CreateQuestionScreen() {
  const { subjectId, grade } = useLocalSearchParams();
  const router = useRouter();

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState("Dễ"); // 🆕 default value

  const { setLoading } = useLoadingStore();

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
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin và chọn đáp án đúng.");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "questions"), {
        subjectId,
        grade,
        questionText,
        options,
        correctAnswer,
        difficulty, // 🆕 save difficulty level
        createdAt: new Date(),
      });
      setLoading(false);

      Alert.alert("Thành công", "Tạo câu hỏi thành công!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert("Lỗi", "Không thể tạo câu hỏi, vui lòng thử lại sau.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tạo câu hỏi mới</Text>

      {/* 🆕 Difficulty Picker */}
      <Text style={styles.label}>Độ khó</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={difficulty}
          onValueChange={(value) => setDifficulty(value)}
          style={styles.picker}
        >
          <Picker.Item label="Dễ" value="Dễ" />
          <Picker.Item label="Trung bình" value="Trung bình" />
          <Picker.Item label="Khó" value="Khó" />
        </Picker>
      </View>

      <TextInput
        placeholder="Nhập nội dung câu hỏi"
        value={questionText}
        onChangeText={setQuestionText}
        style={styles.input}
        multiline
      />

      {options.map((opt, index) => (
        <View key={index} style={styles.optionContainer}>
          <Text style={styles.optionLabel}>Đáp án {index + 1}</Text>
          <TextInput
            value={opt}
            onChangeText={(text) => handleOptionChange(index, text)}
            placeholder={`Nhập đáp án ${index + 1}`}
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <Button
              title={
                correctAnswer === index
                  ? "Đáp án đúng ✅"
                  : "Chọn làm đáp án đúng"
              }
              onPress={() => setCorrectAnswer(index)}
              color={correctAnswer === index ? "#16A34A" : "#007AFF"}
            />
          </View>
        </View>
      ))}

      <View style={styles.submitButton}>
        <Button title="Tạo câu hỏi" onPress={handleSubmit} color="#007AFF" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8FAFC",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 15,
  },
  picker: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 15,
  },
  optionContainer: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 5,
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
});
