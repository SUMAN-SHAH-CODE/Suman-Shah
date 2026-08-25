import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Default Firebase configuration object.
// In production, replacing environment variables or passing real Firebase credentials connects directly.
export const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyForCinematicPortfolioApp123456",
  authDomain: "cinematic-portfolio.firebaseapp.com",
  projectId: "cinematic-portfolio",
  storageBucket: "cinematic-portfolio.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

export function getFirebaseApp(): FirebaseApp {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  return getApp();
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function getFirebaseFirestore(): Firestore {
  return getFirestore(getFirebaseApp());
}
