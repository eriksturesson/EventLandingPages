import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectDatabaseEmulator, getDatabase } from 'firebase/database';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { awesomeLogStyle } from './awesomeLogStyle';

type CONFIGS = 'development' | 'production';
export const devSettings: CONFIGS = import.meta.env.VITE_NODE_ENV === 'production' ? 'production' : 'development';
///////////////////////////////////////
//LOCAL VARIABLE FOR URL TO CLOUD FUNCTION REQUEST
let beginingOfCloudFunctionRequestUrl = '';
///////////////////////////////////////

// See: https://firebase.google.com/docs/web/learn-more#config-object
let config = {};
if (devSettings === 'development') {
   console.log(`%c FIREBASE devSettings = ${devSettings}`, awesomeLogStyle);
   beginingOfCloudFunctionRequestUrl = `http://127.0.0.1:5001/${import.meta.env.VITE_FIREBASE_PROJECT_ID}/us-central1/`;

   config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      databaseURL: 'https://emulator.firebaseio.com',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      // measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
   };
} else if (devSettings === 'production') {
   console.error(`%c FIREBASE devSettings = ${devSettings}`, awesomeLogStyle);
   beginingOfCloudFunctionRequestUrl = `https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/`;
   config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      // measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
   };
}

// Initialize Firebase

const app = initializeApp(config);
export const auth = getAuth(app);
export const functions = getFunctions(app);

// Initialize Realtime Database and get a reference to the service
export const storage = getStorage();
export const db = getDatabase(app);

if (devSettings === 'development') {
   connectAuthEmulator(auth, 'http://localhost:9099');
   connectFunctionsEmulator(functions, 'localhost', 5001);
   connectDatabaseEmulator(db, 'localhost', 9000);
   connectStorageEmulator(storage, 'localhost', 9199);
}

export const createAdminURL: string = beginingOfCloudFunctionRequestUrl + 'createAdmin';
export const inviteAdminURL: string = beginingOfCloudFunctionRequestUrl + 'inviteAdmin';
export const getAdminsURL: string = beginingOfCloudFunctionRequestUrl + 'getAdmins';
