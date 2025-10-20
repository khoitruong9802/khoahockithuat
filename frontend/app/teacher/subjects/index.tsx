import { useEffect, useState } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker"; // <-- Add this package
import { db } from "../../../lib/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import { useAppStore } from "../../../store";
import { useRouter } from "expo-router";
import { useLoadingStore } from "@/store/loadingSlice";

export default function SubjectListScreen() {
  const { user } = useAppStore();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<{
    [key: string]: string;
  }>({});
  const router = useRouter();
  const { setLoading } = useLoadingStore();

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!user) return;
      setLoading(true);
      const q = query(collection(db, "subjects"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSubjects(data);
      setLoading(false);
    };

    fetchSubjects();
  }, [setLoading, user]);

  const handleSelectGrade = (subjectId: string, grade: string) => {
    setSelectedGrades((prev) => ({
      ...prev,
      [subjectId]: grade,
    }));
  };

  const handleCreateQuestion = (item: any) => {
    const selectedGrade = selectedGrades[item.id];
    if (!selectedGrade) {
      alert("Vui lòng chọn khối trước khi tạo câu hỏi!");
      return;
    }

    router.push({
      pathname: "/teacher/subjects/[subjectId]/questions",
      params: {
        subjectId: item.id,
        name: item.name,
        grade: selectedGrade,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Môn học</Text>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.subjectCard}>
            <Text style={styles.subjectName}>{item.name}</Text>

            {/* ✅ Select box: "Chọn khối" */}
            <Text style={styles.label}>Chọn khối:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedGrades[item.id] || ""}
                onValueChange={(value) => handleSelectGrade(item.id, value)}
                style={styles.picker}
              >
                <Picker.Item label="-- Chọn khối --" value="" />
                <Picker.Item label="Khối 10" value="10" />
                <Picker.Item label="Khối 11" value="11" />
                <Picker.Item label="Khối 12" value="12" />
              </Picker>
            </View>

            <Button
              title="Quản lí câu hỏi"
              onPress={() => handleCreateQuestion(item)}
              color="#007AFF"
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8FAFC",
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1E293B",
  },
  subjectCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#334155",
  },
  label: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 4,
  },
  pickerContainer: {
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    color: "#1E293B",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
});
