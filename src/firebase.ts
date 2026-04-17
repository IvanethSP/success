// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// La configuración de tu proyecto FUXI MLM en Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCuXIjb--mrvp4i81f6Bs86gchKpMRQNDI",
  authDomain: "app-fuxi-mlm.firebaseapp.com",
  projectId: "app-fuxi-mlm",
  storageBucket: "app-fuxi-mlm.firebasestorage.app",
  messagingSenderId: "247333189066",
  appId: "1:247333189066:web:359a359da56166e1280b33",
  measurementId: "G-00ZCYD148W"
};

// Inicializar la app de Firebase
const app = initializeApp(firebaseConfig);

// Inicializar la base de datos Firestore y exportarla para uso en la app
export const db = getFirestore(app);
