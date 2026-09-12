// Phase 0/1 — Firebase web config (env-only, no secrets committed).
// .env.local holds VITE_FIREBASE_*. Until present, firebaseConfigured is false
// and the app runs on local cache with anonymous-auth disabled.

export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string | undefined;
  messagingSenderId?: string | undefined;
  appId?: string | undefined;
  measurementId?: string | undefined;
};

type FirebaseApp = unknown;
type FirebaseAuth = unknown;
type FirestoreDb = unknown;

function readEnv(name: string): string {
  try {
    const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
    const v = env?.[name];
    return typeof v === "string" ? v.trim() : "";
  } catch {
    return "";
  }
}

export function getFirebaseWebConfig(): FirebaseWebConfig | null {
  const apiKey = readEnv("VITE_FIREBASE_API_KEY");
  const authDomain = readEnv("VITE_FIREBASE_AUTH_DOMAIN");
  const projectId = readEnv("VITE_FIREBASE_PROJECT_ID");
  if (!apiKey || !authDomain || !projectId) return null;
  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket: readEnv("VITE_FIREBASE_STORAGE_BUCKET") || undefined,
    messagingSenderId: readEnv("VITE_FIREBASE_MESSAGING_SENDER_ID") || undefined,
    appId: readEnv("VITE_FIREBASE_APP_ID") || undefined,
    measurementId: readEnv("VITE_FIREBASE_MEASUREMENT_ID") || undefined,
  };
}

export const firebaseConfigured: boolean = getFirebaseWebConfig() !== null;

let appPromise: Promise<FirebaseApp> | null = null;
let authPromise: Promise<FirebaseAuth> | null = null;
let dbPromise: Promise<FirestoreDb> | null = null;

async function loadFirebaseApp(): Promise<FirebaseApp> {
  const config = getFirebaseWebConfig();
  if (!config) throw new Error("firebase_not_configured");
  const mod = (await import("firebase/app")) as unknown as {
    initializeApp: (c: FirebaseWebConfig) => FirebaseApp;
    getApps: () => FirebaseApp[];
    getApp: () => FirebaseApp;
  };
  if (mod.getApps().length > 0) return mod.getApp();
  return mod.initializeApp(config);
}

export function getFirebaseAppAsync(): Promise<FirebaseApp> {
  if (!appPromise) appPromise = loadFirebaseApp();
  return appPromise;
}

export async function getFirebaseAuthAsync(): Promise<FirebaseAuth> {
  if (!authPromise) {
    authPromise = (async () => {
      const app = await getFirebaseAppAsync();
      const mod = (await import("firebase/auth")) as unknown as {
        getAuth: (a: FirebaseApp) => FirebaseAuth;
      };
      return mod.getAuth(app);
    })();
  }
  return authPromise;
}

export async function getFirestoreDbAsync(): Promise<FirestoreDb> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const app = await getFirebaseAppAsync();
      const mod = (await import("firebase/firestore")) as unknown as {
        getFirestore: (a: FirebaseApp) => FirestoreDb;
      };
      return mod.getFirestore(app);
    })();
  }
  return dbPromise;
}

export function resetFirebaseForTests(): void {
  appPromise = null;
  authPromise = null;
  dbPromise = null;
}

