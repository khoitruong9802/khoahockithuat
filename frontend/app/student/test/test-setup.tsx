import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useTestStore } from "@/store/testSlice";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { useAppStore } from "@/store";

export default function TestSetupScreen() {
  const [subjectId, setSubjectId] = useState("");
  const [questionCount, setQuestionCount] = useState("5");
  const [subjects, setSubjects] = useState<any[]>([]);
  const router = useRouter();
  const startTest = useTestStore((state) => state.startTest);
  const { grade } = useAppStore();

  useEffect(() => {
    const fetchSubjects = async () => {
      const snapshot = await getDocs(collection(db, "subjects"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSubjects(data);
    };
    fetchSubjects();
  }, []);

  const handleStartTest = async () => {
    if (!subjectId || !questionCount) {
      Alert.alert("Thông báo", "Vui lòng chọn môn học và số lượng câu hỏi");
      return;
    }

    const q = query(
      collection(db, "questions"),
      where("subjectId", "==", subjectId),
      where("grade", "==", grade)
    );
    const snapshot = await getDocs(q);
    const allQuestions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const count = parseInt(questionCount);
    if (count > allQuestions.length) {
      Alert.alert(
        "Thông báo",
        "Số lượng câu hỏi trong ngân hàng câu hỏi không đủ. Vui lòng nhập số nhỏ hơn"
      );
      return;
    }

    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    startTest(subjectId, selected);
    router.replace("/student/test/do-test");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Chọn môn học</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={subjectId}
          onValueChange={(itemValue) => setSubjectId(itemValue)}
        >
          <Picker.Item label="-- Chọn môn học --" value="" />
          {subjects.map((subj) => (
            <Picker.Item key={subj.id} label={subj.name} value={subj.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Số lượng câu hỏi</Text>
      <TextInput
        value={questionCount}
        onChangeText={setQuestionCount}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title="Bắt đầu kiểm tra" onPress={handleStartTest} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
});
