import { getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

const FIREBASE_ENV_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

type FirebaseEnvKey = (typeof FIREBASE_ENV_KEYS)[number];

function readFirebaseEnv(key: FirebaseEnvKey): string | undefined {
  const value = import.meta.env[key]?.trim();
  return value ? value : undefined;
}

export const missingFirebaseEnvKeys = FIREBASE_ENV_KEYS.filter((key) => !readFirebaseEnv(key));

function createFirebaseConfig(): FirebaseOptions | null {
  if (missingFirebaseEnvKeys.length > 0) return null;

  return {
    apiKey: readFirebaseEnv('VITE_FIREBASE_API_KEY')!,
    authDomain: readFirebaseEnv('VITE_FIREBASE_AUTH_DOMAIN')!,
    projectId: readFirebaseEnv('VITE_FIREBASE_PROJECT_ID')!,
    storageBucket: readFirebaseEnv('VITE_FIREBASE_STORAGE_BUCKET')!,
    messagingSenderId: readFirebaseEnv('VITE_FIREBASE_MESSAGING_SENDER_ID')!,
    appId: readFirebaseEnv('VITE_FIREBASE_APP_ID')!,
  };
}

const firebaseConfig = createFirebaseConfig();

export const firebaseConfigError =
  missingFirebaseEnvKeys.length > 0
    ? import.meta.env.DEV
      ? `Firebase is not configured. Missing: ${missingFirebaseEnvKeys.join(', ')}.`
      : 'The application form is temporarily unavailable.'
    : null;

export const firebaseSetupHint =
  missingFirebaseEnvKeys.length > 0 && import.meta.env.DEV
    ? 'Add the Firebase values to .env.local or your deployment secrets.'
    : null;

if (firebaseConfigError && import.meta.env.DEV) {
  console.warn(`[firebase] ${firebaseConfigError} ${firebaseSetupHint ?? ''}`.trim());
}

const app =
  firebaseConfig === null
    ? null
    : getApps().length > 0
      ? getApps()[0]!
      : initializeApp(firebaseConfig);

export const db: Firestore | null = app ? getFirestore(app) : null;
export const isFirebaseConfigured = db !== null;
