// store/resultSlice.ts
import { create } from "zustand";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

type Result = {
  id: string;
  studentName: string;
  subjectName: string;
  score: number;
  total: number;
  timestamp: string;
};

type ResultState = {
  results: Result[];
  loading: boolean;
  fetchResultsForTeacher: (teacherId: string) => Promise<void>;
  fetchResultsForStudent: (studentId: string) => Promise<void>;
};

export const useResultStore = create<ResultState>((set) => ({
  results: [],
  loading: false,

  fetchResultsForTeacher: async (teacherId) => {
    set({ loading: true });

    const subjectSnapshot = await getDocs(
      query(collection(db, "subjects"), where("teacherId", "==", teacherId))
    );
    const subjects = subjectSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));

    const allResults: Result[] = [];

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
          studentName,
          subjectName: subject.name,
          score: test.score,
          total: test.answers.length,
          timestamp: test.timestamp.toDate().toLocaleString(),
        });
      }
    }

    set({ results: allResults, loading: false });
  },

  fetchResultsForStudent: async (studentId) => {
    set({ loading: true });

    const testSnapshot = await getDocs(
      query(collection(db, "tests"), where("studentId", "==", studentId))
    );

    const allResults: Result[] = await Promise.all(
      testSnapshot.docs.map(async (docSnap) => {
        const test = docSnap.data();
        const subjectDoc = await getDoc(doc(db, "subjects", test.subjectId));
        const subjectName = subjectDoc.exists()
          ? subjectDoc.data().name
          : "Unknown";

        return {
          id: docSnap.id,
          studentName: "", // not needed for student view
          subjectName,
          score: test.score,
          total: test.answers.length,
          timestamp: test.timestamp.toDate().toLocaleString(),
        };
      })
    );

    set({ results: allResults, loading: false });
  },
}));
