import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { firebaseConfig } from './firebaseConfig';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
export const devSettings: 'EMULATORS' | 'PRODUCTION' = 'EMULATORS';
console.log('devSettings', devSettings);
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();
export const storage = getStorage();
if (devSettings === 'EMULATORS') {
   connectAuthEmulator(auth, 'http://localhost:9099');
   connectDatabaseEmulator(db, 'localhost', 9000);
   connectStorageEmulator(storage, '127.0.0.1', 9199);
}
