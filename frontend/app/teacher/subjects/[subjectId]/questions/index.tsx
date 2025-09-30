import { useEffect, useState } from "react";
import { View, Text, Button, FlatList, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function QuestionListScreen() {
  const { subjectId } = useLocalSearchParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      const q = query(
        collection(db, "questions"),
        where("subjectId", "==", subjectId)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setQuestions(data);
      setLoading(false);
    };

    fetchQuestions();
  }, [subjectId]);

  if (loading) return <ActivityIndicator />;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Questions</Text>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontWeight: "bold" }}>{item.questionText}</Text>
            {item.options.map((opt: string, index: number) => (
              <Text key={index}>
                {index + 1}. {opt} {item.correctAnswer === index ? "✅" : ""}
              </Text>
            ))}
          </View>
        )}
      />
      <Button
        title="Create New Question"
        onPress={() =>
          router.push(`/teacher/subjects/${subjectId}/questions/create`)
        }
      />
    </View>
  );
}
