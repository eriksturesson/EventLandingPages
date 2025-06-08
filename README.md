# Readme

-  This is a plattform for creating one or more landingpages for event(s) from one single codebase that an admin can edit (a CMS for eventpages).
-  Registrations (personal data) is handled via the call-to-action botton that you can lead to a form (google form etc), it is not handled in the platform.
-  The first version is not done yet, please wait while rebuilding older code to react.
-  This project uses firebase with "no-cost" plan from start. Just upgrade your plan if needed for production uses with more data and/or users.

# You need to know this before starting:

-  Typescript
-  React
-  How to set up a Firebase project

# How to set up:

1. A: Create a Firebase Project

   -  Create your firebase project at firebase.com
   -  Follow Firebase's own steps for deploying and setting up your project. Use `firebase init`. Install, when asked all these: `emulators`, `cloud functions`, `realtime database`, `storage` and `hosting`. Don't overwrite the `database.rules.json` nor `firebase.json` when asked during the installation (we set that up for you!).
   -  Add the firebase config into the `.env`file you create in the root. See "Environment Configuration". You find your firebaseConfig in the firebase console --> firebase settings --> General
   -  For production later, set up cleanup policy to remove backend images automatically to reduce costs

1. B: Copy our database and storage rules from the root-folder `config`.

1. ##

📁 Environment Configuration
Create a .env file in the root folder of your project and add your Firebase config like this:

```ts
VITE_FIREBASE_API_KEY = yourApikey;
VITE_FIREBASE_AUTH_DOMAIN = yourAuthDomain;
VITE_FIREBASE_PROJECT_ID = yourProjectID;
VITE_FIREBASE_STORAGE_BUCKET = yourStorageBucket;
VITE_FIREBASE_MESSAGING_SENDER_ID = yourMessageSenderID;
VITE_FIREBASE_APP_ID = yourAppID;
```

3. Change the storage.rules files to fit the name of your storage bucket link:

```
rules_version = '2';
service firebase.storage {
  match /b/YOUR_BUCKET_ID.appspot.com/o {
    match /{allPaths=**} {
        allow read;
        allow write: if request.auth != null;
    }
  }
}
```

# Emulate your code:

-  Run `npm run emulators`
-  All users are admins currently, so just create a user with email and password in firebase emulator (standard set tolocalhost:4000, in the auth-section) and login with those credentials. Everytime you restart the firebase emulators you will need to recreate your user.

3. Deploy to firebase (not tested yet)

-run `npm run build`(react-scripts runs build)
-run `firebase deploy`

# Todo codewise:

1. DB Security rules (unmentioned details)
2. Check how to, or inform here in readme about how to limit datause to limit costs after a DDOS-attack
3. Cookie Banner if Google Analytics or other cookies are stored
4. Admin editing of pitchcards, backend functionality not implemented yet (style implemented)
5. Admin editing of map, footer, sub-pages, top video/img, speaker(s) and organizers/participants
6. Implement different css styles for different websites (fonts and colors for different webbpages, now all fonts will be the same for all landingpages)
7. Implement adminRoles in db and implement that in the code. Currently all users are admins for all landingpages in the codebase.
8. Go from firebase `realtime database` to `firestore database`

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3002](http://localhost:3002) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
