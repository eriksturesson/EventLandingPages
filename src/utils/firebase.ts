import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectDatabaseEmulator, getDatabase } from 'firebase/database';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { awesomeLogStyle } from './awesomeLogStyle';
import { firebaseConfig } from './firebaseConfig';

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
   beginingOfCloudFunctionRequestUrl = `http://127.0.0.1:5001/${firebaseConfig.projectId}/us-central1/`;

   config = {
      apiKey: firebaseConfig.apiKey,
      authDomain: firebaseConfig.apiKey,
      databaseURL: 'https://emulator.firebaseio.com',
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      messagingSenderId: firebaseConfig.messagingSenderId,
      appId: firebaseConfig.appId,
   };
} else if (devSettings === 'production') {
   console.error(`%c FIREBASE devSettings = ${devSettings}`, awesomeLogStyle);
   beginingOfCloudFunctionRequestUrl = `https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net/`;
   config = {
      apiKey: firebaseConfig.apiKey,
      authDomain: firebaseConfig.apiKey,
      databaseURL: firebaseConfig.databaseURL,
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      messagingSenderId: firebaseConfig.messagingSenderId,
      appId: firebaseConfig.appId,
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

export const ourUpcommingCloudFunctionRequestUrl: string = beginingOfCloudFunctionRequestUrl + 'OurUpcommingFunctionName';
