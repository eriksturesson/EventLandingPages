import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { firebaseConfig } from "./config";
const devSettings = "EMULATORS";
console.log("devSettings", devSettings);
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();
if (devSettings === "EMULATORS") {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectDatabaseEmulator(db, "localhost", 9000);
}
