import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
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

export default function TeacherResultsScreen() {
  const { user } = useAppStore();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;

      // 1. 教師の科目を取得
      const subjectSnapshot = await getDocs(
        query(collection(db, "subjects"), where("teacherId", "==", user.uid))
      );
      const subjects = subjectSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));

      // 2. 各科目に関連するテストを取得
      const allResults: any[] = [];
      for (const subject of subjects) {
        const testSnapshot = await getDocs(
          query(collection(db, "tests"), where("subjectId", "==", subject.id))
        );

        for (const testDoc of testSnapshot.docs) {
          const test = testDoc.data();
          const studentDoc = await getDoc(doc(db, "users", test.studentId));
          const studentName = studentDoc.exists()
            ? studentDoc.data().email
            : "Unknown";

          allResults.push({
            id: testDoc.id,
            subjectName: subject.name,
            studentName,
            score: test.score,
            total: test.answers.length,
            timestamp: test.timestamp.toDate().toLocaleString(),
          });
        }
      }

      setResults(allResults);
      setLoading(false);
    };

    fetchResults();
  }, [user]);

  if (loading) return <ActivityIndicator />;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Student Test Results
      </Text>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text>Student: {item.studentName}</Text>
            <Text>Subject: {item.subjectName}</Text>
            <Text>
              Score: {item.score} / {item.total}
            </Text>
            <Text>Date: {item.timestamp}</Text>
          </View>
        )}
      />
    </View>
  );
}
