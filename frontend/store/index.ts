// store/index.ts
import { create } from "zustand";
import { User } from "firebase/auth";

type AppState = {
  user: User | null;
  role: "teacher" | "student" | null;
  grade: "10" | "11" | "12" | null;
  setUser: (
    user: User | null,
    role: "teacher" | "student" | null,
    grade: "10" | "11" | "12" | null
  ) => void;
  clearUser: () => void;
  logout: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  user: null,
  role: null,
  grade: null,
  setUser: (user, role, grade) => set({ user, role, grade }),

  // clears only user info but keeps other states
  clearUser: () => set({ user: null }),

  // completely reset the store
  logout: () => set({ user: null, role: null, grade: null }),
}));
