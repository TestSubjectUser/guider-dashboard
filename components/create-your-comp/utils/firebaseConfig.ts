import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJf0ANNwD7BwQt67UeOdnfMB5-m1jiZcc",
  authDomain: "guider-extension.firebaseapp.com",
  projectId: "guider-extension",
  storageBucket: "guider-extension.firebasestorage.app",
  messagingSenderId: "968649024174",
  appId: "1:968649024174:web:94d863ab0c348afac7833f",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
