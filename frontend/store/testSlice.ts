// store/testSlice.ts
import { create } from "zustand";

type Question = {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
};

type TestState = {
  currentTest: {
    subjectId: string;
    questions: Question[];
    answers: (number | null)[];
  } | null;
  testProgress: number;
  startTest: (subjectId: string, questions: Question[]) => void;
  answerQuestion: (index: number, answer: number) => void;
  resetTest: () => void;
};

export const useTestStore = create<TestState>((set) => ({
  currentTest: null,
  testProgress: 0,
  startTest: (subjectId, questions) =>
    set({
      currentTest: {
        subjectId,
        questions,
        answers: Array(questions.length).fill(null),
      },
      testProgress: 0,
    }),
  answerQuestion: (index, answer) =>
    set((state) => {
      if (!state.currentTest) return state;
      const updatedAnswers = [...state.currentTest.answers];
      updatedAnswers[index] = answer;
      return {
        currentTest: {
          ...state.currentTest,
          answers: updatedAnswers,
        },
      };
    }),
  resetTest: () => set({ currentTest: null, testProgress: 0 }),
}));
