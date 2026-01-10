import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

function requireEnv(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];
  if (!value) throw new Error(`Missing ${key}`);
  return value;
}

const app =
  getApps().length > 0
    ? getApps()[0]!
    : initializeApp({
        apiKey: requireEnv('VITE_FIREBASE_API_KEY'),
        authDomain: requireEnv('VITE_FIREBASE_AUTH_DOMAIN'),
        projectId: requireEnv('VITE_FIREBASE_PROJECT_ID'),
        storageBucket: requireEnv('VITE_FIREBASE_STORAGE_BUCKET'),
        messagingSenderId: requireEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
        appId: requireEnv('VITE_FIREBASE_APP_ID')
      });

export const db = getFirestore(app);

