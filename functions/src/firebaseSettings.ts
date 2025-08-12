import { App, getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import dotenv from 'dotenv';

dotenv.config();

const isDev = process.env.NODE_ENV !== 'production';
const projectId = process.env.PROJECT_ID;
const databaseUrl = process.env.DATABASE_URL;

console.log('Relevant environment variables:', {
   NODE_ENV: process.env.NODE_ENV,
   PROJECT_ID: projectId,
   DATABASE_URL: databaseUrl,
   GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS ?? '[NOT SET]',
});

if (!isDev) {
   if (!projectId) throw new Error('Missing PROJECT_ID environment variable!');
   if (!databaseUrl) throw new Error('Missing DATABASE_URL environment variable!');
   console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
}

const firebaseConfig = isDev
   ? { databaseURL: 'http://localhost:9000?ns=emulator' }
   : {
        credential: applicationDefault(),
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
