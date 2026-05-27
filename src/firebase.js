// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJa80pyLvrB0xmXLSmpcqAdcmIlxa5RcI",
  authDomain: "todo-55f98.firebaseapp.com",
  projectId: "todo-55f98",
  storageBucket: "todo-55f98.firebasestorage.app",
  messagingSenderId: "207208714556",
  appId: "1:207208714556:web:9c4c4df8f0c1bb61314e39",
  measurementId: "G-QFTY4HW6LX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);