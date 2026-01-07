import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAx0oIUoo1HvAcOPZYYclB75ctwKzzE3X4",
  authDomain: "ai-mental-health-tracker.firebaseapp.com",
  projectId: "ai-mental-health-tracker",
  storageBucket: "ai-mental-health-tracker.firebasestorage.app",
  messagingSenderId: "439282228350",
  appId: "1:439282228350:web:173f1944d3cea390cecc2f",
  measurementId: "G-JD7EH4FCXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;