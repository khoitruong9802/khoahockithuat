// store/index.ts
import { create } from "zustand";
import { User } from "firebase/auth";

type AppState = {
  user: User | null;
  role: "teacher" | "student" | null;
  setUser: (user: User, role: "teacher" | "student") => void;
  logout: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  user: null,
  role: null,
  setUser: (user, role) => set({ user, role }),
  logout: () => set({ user: null, role: null }),
}));
