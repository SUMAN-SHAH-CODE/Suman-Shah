import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyBurb0QdwdlmrvEYrfxxVMC8elgUh_u7nY",
  authDomain: "my-profile-37d3d.firebaseapp.com",
  projectId: "my-profile-37d3d",
  storageBucket: "my-profile-37d3d.firebasestorage.app",
  messagingSenderId: "909364426489",
  appId: "1:909364426489:web:b45975c780bacf1082d428",
  measurementId: "G-WJ6VXTTCK8"
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
