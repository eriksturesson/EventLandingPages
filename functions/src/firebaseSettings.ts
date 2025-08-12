import { App, getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import dotenv from 'dotenv';
dotenv.config();

const isDev = process.env.NODE_ENV !== 'production';
const projectId = process.env.PROJECT_ID;
const databaseUrl = process.env.DATABASE_URL;

console.log('Project ID:', projectId);
console.log('Database URL:', databaseUrl);

if (!isDev) {
   if (!projectId) throw new Error('Missing PROJECT_ID environment variable!');
   if (!databaseUrl) throw new Error('Missing DATABASE_URL environment variable!');
   if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_JSON environment variable!');
   }
}

const firebaseConfig = isDev
   ? {
        databaseURL: 'http://localhost:9000?ns=emulator',
     }
   : {
        credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON!)),
        projectId,
        databaseURL: databaseUrl,
     };

const app: App = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

console.log('Firebase Admin initialized with projectId:', app.options.projectId);

const db = getDatabase(app);

if (isDev) {
   db.useEmulator('localhost', 9000);
}

const auth = getAuth(app);

export { app, auth, db };
