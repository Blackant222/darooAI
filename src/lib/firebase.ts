import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "studio-3168451140-806fc",
  "appId": "1:665197872529:web:6ec2453d738b54e3b78630",
  "apiKey": "AIzaSyDqBYLOuWZV7DjQhNcmJaoAJ1lWIHlwwS8",
  "authDomain": "studio-3168451140-806fc.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "665197872529"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
