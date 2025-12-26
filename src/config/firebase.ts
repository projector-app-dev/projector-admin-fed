// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_WVXHqn7MnFR6cYkzVA1YLjfOWP1APGo",
  authDomain: "projector-cm.firebaseapp.com",
  projectId: "projector-cm",
  storageBucket: "projector-cm.firebasestorage.app",
  messagingSenderId: "622639191268",
  appId: "1:622639191268:web:10985d10df1f0c5a4648f1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
