import { firebaseConfig } from '../src/components/utils/firebaseConfig';

const API_KEY = firebaseConfig.apiKey;

const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');

const raw = JSON.stringify({
   email: 'a@a.com',
   password: 'asdasd',
});

const requestOptions: RequestInit = {
   method: 'POST',
   headers: myHeaders,
   body: raw,
   redirect: 'follow',
};

fetch(`http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, requestOptions)
   .then((response) => response.json())
   .then((result) => {
      console.info(`Successfully created new user with email ${result.email}`);
   })
   .catch((error) => console.log('error', error));
