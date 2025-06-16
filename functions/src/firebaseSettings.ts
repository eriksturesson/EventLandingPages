import dotenv from 'dotenv';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
dotenv.config();
const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
   process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
}

const app =
   getApps().length === 0
      ? initializeApp({
           databaseURL: isDev ? 'http://localhost:9000?ns=emulator' : process.env.FIREBASE_DATABASE_URL,
        })
      : getApps()[0];

const db = getDatabase(app);

if (isDev) {
   db.useEmulator('localhost', 9000);
}

const auth = getAuth(app);

export { app, auth, db };
