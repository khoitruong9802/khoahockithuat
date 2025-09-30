import { View, Text, Button } from "react-native";
import { useTestStore } from "@/store/testSlice";
import { useRouter } from "expo-router";

export default function TestResultScreen() {
  const { currentTest, resetTest } = useTestStore();
  const router = useRouter();

  if (!currentTest) return <Text>Không có kết quả kiểm tra</Text>;

  const { questions, answers } = currentTest;
  const score = questions.reduce((acc, q, i) => {
    return acc + (q.correctAnswer === answers[i] ? 1 : 0);
  }, 0);

  const handleBack = () => {
    resetTest();
    router.replace("/student");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Số điểm: {score} / {questions.length}
      </Text>

      {questions.map((q, index) => (
        <View key={q.id} style={{ marginVertical: 10 }}>
          <Text style={{ fontWeight: "bold" }}>
            {index + 1}. {q.questionText}
          </Text>
          <Text>Câu trả lời của bạn: {q.options[answers[index] ?? -1]}</Text>
          <Text>Câu trả lời đúng: {q.options[q.correctAnswer]}</Text>
          <Text
            style={{
              color: q.correctAnswer === answers[index] ? "green" : "red",
            }}
          >
            {q.correctAnswer === answers[index] ? "✅ Correct" : "❌ Incorrect"}
          </Text>
        </View>
      ))}

      <Button title="Quay về trang chủ" onPress={handleBack} />
    </View>
  );
}
