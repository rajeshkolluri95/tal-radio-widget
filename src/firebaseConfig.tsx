import { useMemo } from "react";
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getFirestore, type Firestore } from "firebase/firestore"

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

export interface FirebaseInstances {
  app: FirebaseApp;
  database: Database;
  storage: FirebaseStorage;
}

export const firebaseConfig: {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
} = {
  apiKey: import.meta.env.VITE_PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const useFirebaseServices = (config: FirebaseConfig): FirebaseInstances & { realtimeDb: Database; firestoreDb: Firestore } => {
  const firebaseInstances = useMemo(() => {
    if (!config?.apiKey) {
      throw new Error("Missing Firebase configuration");
    }

    // ✅ Ensure Firebase app initializes only once
    const app = getApps().length ? getApp() : initializeApp(config);
    const database = getDatabase(app);
    const storage = getStorage(app);
    const realtimeDb = getDatabase(app);
    const firestoreDb = getFirestore(app);

    console.log("✅ Firebase initialized:", app.name);

    return { app, database, storage ,realtimeDb,firestoreDb};
  }, [config]);

  return firebaseInstances;
};
