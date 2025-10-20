import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useTestStore } from "@/store/testSlice";
import { useAppStore } from "@/store";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function TestScreen() {
  const { currentTest, answerQuestion } = useTestStore();
  const { user } = useAppStore();
  const router = useRouter();

  if (!currentTest) return <Text>Không có bài kiểm tra</Text>;

  const { questions, answers } = currentTest;

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    answerQuestion(questionIndex, optionIndex);
  };

  const handleSubmit = async () => {
    const score = questions.reduce((acc, q, i) => {
      return acc + (q.correctAnswer === answers[i] ? 1 : 0);
    }, 0);

    try {
      await addDoc(collection(db, "tests"), {
        studentId: user?.uid,
        subjectId: currentTest.subjectId,
        questions: questions.map((q) => q.id),
        answers,
        score,
        timestamp: new Date(),
      });

      Alert.alert("Test Submitted", `Your score: ${score}/${questions.length}`);
      router.replace("/student/test/result");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to submit test");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Page Title */}
      <Text style={styles.pageTitle}>Kiểm tra</Text>

      {questions.map((q, index) => (
        <View key={q.id} style={styles.questionBlock}>
          <Text style={styles.questionText}>
            {index + 1}. {q.questionText}
          </Text>
          {q.options.map((opt, optIndex) => {
            const selected = answers[index] === optIndex;
            return (
              <Pressable
                key={optIndex}
                onPress={() => handleSelect(index, optIndex)}
                style={[styles.option, selected && styles.selectedOption]}
              >
                <View style={styles.radioCircle}>
                  {selected && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.optionText}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Nộp bài</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50, // extra space for scrolling
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 20,
    textAlign: "center",
  },
  questionBlock: {
    marginBottom: 30,
  },
  questionText: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  optionText: {
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
