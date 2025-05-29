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
   -  Create a file `firebaseConfig.ts` and copy paste your `firebaseConfig` from firebase and export the variable firebaseConfig. Put it here: `src\components\utils\firebaseConfig.ts`. You find your firebaseConfig in the firebase console --> firebase settings --> General

   B: Copy our database and storage rules from the root-folder `config`.

2. Change the storage.rules files to fit the name of your storage bucket link:

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

# The project was started with Create React App, here are the separate instructions from "Create React App":

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
