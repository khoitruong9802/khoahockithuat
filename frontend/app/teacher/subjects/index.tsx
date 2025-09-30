import { useEffect, useState } from "react";
import { View, Text, Button, FlatList, ActivityIndicator } from "react-native";
import { db } from "../../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAppStore } from "../../../store";
import { useRouter } from "expo-router";

export default function SubjectListScreen() {
  const { user } = useAppStore();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!user) return;
      const q = query(
        collection(db, "subjects"),
        where("teacherId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSubjects(data);
      setLoading(false);
    };

    fetchSubjects();
  }, [user]);

  if (loading) return <ActivityIndicator />;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Your Subjects</Text>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text>{item.name}</Text>
            <Button
              title="Manage Questions"
              onPress={() =>
                router.push(`/teacher/subjects/${item.id}/questions`)
              }
            />
          </View>
        )}
      />
      <Button
        title="Create New Subject"
        onPress={() => router.push("/teacher/subjects/create")}
      />
    </View>
  );
}
