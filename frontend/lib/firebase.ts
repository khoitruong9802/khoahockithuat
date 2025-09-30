// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXAj3PioZm-DdCzxY9PZOzH5ZhoqV80ek",
  authDomain: "khoahockithuat-594e0.firebaseapp.com",
  projectId: "khoahockithuat-594e0",
  storageBucket: "khoahockithuat-594e0.firebasestorage.app",
  messagingSenderId: "674560833481",
  appId: "1:674560833481:web:626f9b8d19b0490c671a18",
  measurementId: "G-JWL1FXT0W7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
