import { App, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';

const isDev = process.env.NODE_ENV !== 'production';
console.log('VITE_FIREBASE_DATABASE_URL:', process.env.VITE_FIREBASE_DATABASE_URL);
console.log('VITE_FIREBASE_PROJECT_ID:', process.env.VITE_FIREBASE_PROJECT_ID);

const firebaseConfig = isDev
   ? {
        databaseURL: 'http://localhost:9000?ns=emulator',
     }
   : {
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
        databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
     };

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

console.log('Firebase Admin initialized with projectId:', app?.options?.projectId);

const db = getDatabase(app);

if (isDev) {
   db.useEmulator('localhost', 9000);
}

const auth = getAuth(app);

export { app, auth, db };
