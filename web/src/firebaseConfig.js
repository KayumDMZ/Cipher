import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC0M97xa2ppH7Jn0PVuyae5m3zX6MW43RQ",
  authDomain: "vexa-ccn.firebaseapp.com",
  databaseURL: "https://vexa-ccn-default-rtdb.firebaseio.com",
  projectId: "vexa-ccn",
  storageBucket: "vexa-ccn.firebasestorage.app",
  messagingSenderId: "753444826233",
  appId: "1:753444826233:web:824fd8fcc31935a70978a8",
  measurementId: "G-JTN5Z4R1VP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
