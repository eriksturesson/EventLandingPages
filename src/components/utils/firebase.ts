import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { firebaseConfig } from './firebaseConfig';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { awesomeLogStyle } from './awesomeLogStyle';

type CONFIGS = 'EMULATORS' | 'PRODUCTION'

export const devSettings: CONFIGS = 'EMULATORS';
///////////////////////////////////////
//LOCAL VARIABLE FOR URL TO CLOUD FUNCTION REQUEST
let beginingOfCloudFunctionRequestUrl = '';
///////////////////////////////////////

// See: https://firebase.google.com/docs/web/learn-more#config-object
let config= {}
if (devSettings === 'EMULATORS') {
  console.log(`%c FIREBASE devSettings = ${devSettings}`, awesomeLogStyle);
  beginingOfCloudFunctionRequestUrl = `http://127.0.0.1:5001/${firebaseConfig.projectId}/us-central1/`;

  config = {
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.apiKey,
    databaseURL: "https://emulator.firebaseio.com",
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
  };
} else if (devSettings === 'PRODUCTION') {
  console.error(`%c FIREBASE devSettings = ${devSettings}`, awesomeLogStyle);
  beginingOfCloudFunctionRequestUrl = `https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net/`;
  config = {
   apiKey: firebaseConfig.apiKey,
   authDomain: firebaseConfig.apiKey,
   databaseURL: firebaseConfig.apiKey,
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

if (devSettings === 'EMULATORS') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFunctionsEmulator(functions, 'localhost', 5001);
  connectDatabaseEmulator(db, 'localhost', 9000);
  connectStorageEmulator(storage, 'localhost', 9199);
}

export const ourUpcommingCloudFunctionRequestUrl: string = beginingOfCloudFunctionRequestUrl + 'OurUpcommingFunctionName';