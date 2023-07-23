import { db } from './firebase';
import {
   push,
   ref,
   child,
   update,
   get,
   onValue,
   remove,
   set,
} from 'firebase/database';

interface FirebaseArgs {
   ref?: string;
   data?: any;
   method: 'onValue' | 'push' | 'get' | 'push' | 'update' | 'set' | 'remove'; // There might be more
}

export async function readAndWriteToFirebase(args: FirebaseArgs) {
   //update(ref(db),databaseReferenceObject).then(function (result) { return "done" }) //Old v8
   /* REMEMBER THIS GOOD HINT!
        // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + uid + '/' + newPostKey] = postData;
    return update(ref(db), updates);
    */
   try {
      if (args.method === 'update') {
         let myRef = ref(db as any, args.ref ? args.ref : '');
         return await update(myRef, args.data).then(() => {
            return 'done updating';
         });
      } else if (args.method === 'push') {
         let myRef = ref(db as any, args.ref ? args.ref : '');
         return await push(myRef, args.data).then(() => {
            return 'done pushing';
         });
      } else if (args.method === 'remove') {
         if (!args.ref) {
            throw new Error('You must provide a ref to remove');
         } else {
            let myRef = ref(db as any, args.ref ? args.ref : '');
            return await remove(myRef)
               .then(() => {
                  return 'delete finished';
               })
               .catch((error) => {
                  console.error(error);
                  throw error;
               });
         }
      } else if (args.method === 'get') {
         args.ref == ''
            ? console.error('You must provide a ref to get')
            : console.log('You provided a ref to get', args.ref);
         let myRef = ref(db as any, args.ref ? args.ref : '');
         return await get(myRef)
            .then((snapshot) => {
               if (
                  snapshot.exists() &&
                  (snapshot.val() || snapshot.val() === false)
               ) {
                  return snapshot.val();
               } else {
                  console.error('No data available');
                  return null;
               }
            })
            .catch((error) => {
               console.error(error);
               throw error;
            });
      } else if (args.method === 'onValue') {
         let myRef = ref(db as any, args.ref ? args.ref : '');
         return onValue(myRef, (snapshot) => {
            if (snapshot.exists() && snapshot.val()) {
               const data = snapshot.val();
               return data;
            } else {
               return null;
            }
         });
      } else if (args.method === 'set') {
         let myRef = ref(db as any, args.ref ? args.ref : '');
         return await set(myRef, args.data).then(() => {
            return 'done updating';
         });
      } else {
         console.log('something went wrong or not implemented yet');
         return 'something went wrong or not implemented yet';
      }
   } catch (error) {
      console.error(error);
      throw error;
   }
}

export async function firebaseDBPushAndReturnKey(args: FirebaseArgs) {
   //firebase.database().ref().push().key; //Old v8
   if (args.ref) {
      return push(child(ref(db as any), args.ref)).key; //New v9
   } else {
      console.log('You must provide a ref to push to');
   }
}
