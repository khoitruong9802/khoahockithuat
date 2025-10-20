import { useEffect, useState, useCallback } from "react";
import { View, Text, Button, FlatList, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { useLoadingStore } from "@/store/loadingSlice";

export default function QuestionListScreen() {
  const { subjectId, name, grade } = useLocalSearchParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const { setLoading } = useLoadingStore();
  const router = useRouter();

  const fetchQuestions = useCallback(async () => {
    try {
      if (!subjectId || !grade) return;

      const q = query(
        collection(db, "questions"),
        where("subjectId", "==", subjectId),
        where("grade", "==", grade)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, grade, subjectId]);

  const handleDelete = async (questionId: string) => {
    Alert.alert("Xóa câu hỏi", "Bạn có chắc chắn muốn xóa câu hỏi này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await deleteDoc(doc(db, "questions", questionId));
            setQuestions((prev) =>
              prev.filter((item) => item.id !== questionId)
            );
          } catch (error) {
            console.error("Error deleting question:", error);
            Alert.alert("Lỗi", "Không thể xóa câu hỏi. Vui lòng thử lại.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      fetchQuestions();
    }, [fetchQuestions])
  );

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions, subjectId, grade]);

  return (
    <>
      <Stack.Screen
        options={{
          title: `${name} - Khối ${grade}`,
        }}
      />

      <View style={styles.container}>
        <Text style={styles.title}>Danh sách câu hỏi</Text>

        {questions.length === 0 ? (
          <Text style={styles.emptyText}>Không có câu hỏi</Text>
        ) : (
          <FlatList
            data={questions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.questionCard}>
                <Text style={styles.questionText}>{item.questionText}</Text>

                {/* 🆕 Show difficulty */}
                {item.difficulty && (
                  <Text style={styles.difficulty}>
                    🎯 Độ khó:{" "}
                    <Text
                      style={[
                        styles.difficultyValue,
                        item.difficulty === "Dễ"
                          ? styles.easy
                          : item.difficulty === "Trung bình"
                          ? styles.medium
                          : styles.hard,
                      ]}
                    >
                      {item.difficulty}
                    </Text>
                  </Text>
                )}

                {item.options.map((opt: string, index: number) => (
                  <Text
                    key={index}
                    style={[
                      styles.optionText,
                      item.correctAnswer === index && styles.correctAnswer,
                    ]}
                  >
                    {index + 1}. {opt}{" "}
                    {item.correctAnswer === index ? "✅" : ""}
                  </Text>
                ))}

                <View style={styles.deleteButton}>
                  <Button
                    title="Xóa câu hỏi"
                    color="#EF4444"
                    onPress={() => handleDelete(item.id)}
                  />
                </View>
              </View>
            )}
          />
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Tạo câu hỏi mới"
            onPress={() =>
              router.push({
                pathname: `/teacher/subjects/[subjectId]/questions/create`,
                params: { subjectId, grade },
              })
            }
            color="#007AFF"
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1E293B",
  },
  emptyText: {
    fontSize: 16,
    color: "#64748B",
    fontStyle: "italic",
    marginTop: 5,
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  questionText: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
    color: "#334155",
  },
  difficulty: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
  },
  difficultyValue: {
    fontWeight: "700",
  },
  easy: { color: "#16A34A" }, // green
  medium: { color: "#F59E0B" }, // yellow
  hard: { color: "#DC2626" }, // red
  optionText: {
    fontSize: 15,
    color: "#475569",
    marginVertical: 2,
  },
  correctAnswer: {
    color: "#16A34A",
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
  },
  deleteButton: {
    marginTop: 10,
    alignSelf: "flex-start",
  },
});
