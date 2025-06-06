import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';

export function signOutUser() {
   // SIGN OUT USER //

   signOut(auth)
      .then(() => {
         // Sign-out successful.
         //window.location.href = "login"; //This is handled in App.tsx
      })
      .catch((error) => {
         // An error happened.
      });
}
