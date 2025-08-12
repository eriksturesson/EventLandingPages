import { App, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import dotenv from 'dotenv';
dotenv.config();

const isDev = process.env.NODE_ENV !== 'production';
const projectId = process.env.PROJECT_ID;
const databaseUrl = process.env.DATABASE_URL;

console.log('Project ID:', projectId);
console.log('Database URL:', databaseUrl);

const firebaseConfig = isDev
   ? {
        databaseURL: 'http://localhost:9000?ns=emulator',
     }
   : {
        projectId: process.env.PROJECT_ID,
        databaseURL: process.env.DATABASE_URL,
     };

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

console.log('Firebase Admin initialized with projectId:', app?.options?.projectId);

const db = getDatabase(app);

if (isDev) {
   db.useEmulator('localhost', 9000);
}

const auth = getAuth(app);

export { app, auth, db };
