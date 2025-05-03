import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA78K7q2lYLTeN_-DPlcpvl7OxeEYVbAX0",
  authDomain: "climax4-b6e9d.firebaseapp.com",
  projectId: "climax4-b6e9d",
  storageBucket: "climax4-b6e9d.firebasestorage.app",
  messagingSenderId: "674313767369",
  appId: "1:674313767369:web:ac6c85197698469c090018",
  measurementId: "G-GKF0Q5ZKT8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);