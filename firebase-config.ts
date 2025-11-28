
import * as firebaseApp from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuration from user prompt
const firebaseConfig = {
  apiKey: "AIzaSyDjElpTwlTbXt4Ngr9zS8p_8UoUpEHAdgk",
  authDomain: "croc-frais.firebaseapp.com",
  projectId: "croc-frais",
  storageBucket: "croc-frais.firebasestorage.app",
  messagingSenderId: "734709915656",
  appId: "1:734709915656:web:6aa4fa4d455a29193e71bd",
  measurementId: "G-XJ593697J0"
};

// Initialize Firebase (Modular SDK)
// Use namespace import and casting to bypass TS "no exported member" errors
const appModule = firebaseApp as any;
const app = (appModule.getApps && appModule.getApps().length > 0) 
  ? appModule.getApp() 
  : appModule.initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
