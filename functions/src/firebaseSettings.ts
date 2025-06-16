import dotenv from 'dotenv';
import { App, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
dotenv.config();
const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
   process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
}

const app: App =
   getApps().length === 0
      ? initializeApp(
           isDev
              ? {
                   databaseURL: 'http://localhost:9000?ns=emulator',
                }
              : undefined
        )
      : getApps()[0];

const db = getDatabase(app);

if (isDev) {
   db.useEmulator('localhost', 9000);
}

const auth = getAuth(app);

export { app, auth, db };
