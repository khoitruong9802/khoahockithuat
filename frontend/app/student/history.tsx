import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { db } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAppStore } from "../../store";
import { useLoadingStore } from "@/store/loadingSlice";

export default function HistoryScreen() {
  const { user } = useAppStore();
  const [results, setResults] = useState<any[]>([]);
  const { setLoading } = useLoadingStore();

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;
      setLoading(true);

      const q = query(
        collection(db, "tests"),
        where("studentId", "==", user.uid)
      );
      const snapshot = await getDocs(q);

      const data = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const test = docSnap.data();
          const subjectDoc = await getDoc(doc(db, "subjects", test.subjectId));
          const subjectName = subjectDoc.exists()
            ? subjectDoc.data().name
            : "Unknown";
          return {
            id: docSnap.id,
            score: test.score,
            total: test.answers.length,
            timestamp: test.timestamp.toDate().toLocaleString(),
            subjectName,
          };
        })
      );

      setResults(data);
      setLoading(false);
    };

    fetchResults();
  }, [setLoading, user]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Kết quả làm bài</Text>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text>Môn: {item.subjectName}</Text>
            <Text>
              Điểm số: {item.score} / {item.total}
            </Text>
            <Text>Ngày làm bài: {item.timestamp}</Text>
          </View>
        )}
      />
    </View>
  );
}
