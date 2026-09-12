declare module "firebase/app" {
  const content: any;
  export default content;
  export const initializeApp: any;
  export const getApps: any;
  export const getApp: any;
}

declare module "firebase/auth" {
  export const getAuth: any;
  export const onAuthStateChanged: any;
  export const signInAnonymously: any;
  export const signOut: any;
  export type User = any;
}

declare module "firebase/firestore" {
  export const getFirestore: any;
  export const doc: any;
  export const collection: any;
  export const getDoc: any;
  export const setDoc: any;
  export const addDoc: any;
  export const getDocs: any;
  export const query: any;
  export const orderBy: any;
  export const limit: any;
  export const serverTimestamp: any;
  export const Timestamp: any;
}
