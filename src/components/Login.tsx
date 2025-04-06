// alert('Dubbelkoll av Erik vid utveckling. Om rutan popar upp så funkar mitt javascript samt jquery.');
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './utils/firebase';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import React from 'react';
import { TextField, Button } from '@mui/material';

// CREATE NEW ACCOUNT //
/*
  function createUser() {

    let accountEmailValue = document.getElementById("accountemail").value;
    let passwordValue = document.getElementById("pass").value;
  
   firebase.auth().createUserWithEmailAndPassword(accountEmailValue, passwordValue)
    .then((userCredential) => {
      // Signed in 
      var user = userCredential.user;
      alert("Nu har du skapat ett konto och kan börja logga in framöver. Har du mer frågor, kontakta Erik.");
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
    });
    }
  */
function loginFunction() {
   let accountEmailValue = (document.getElementById('accountemail') as HTMLInputElement).value;
   let passwordValue = (document.getElementById('pass') as HTMLInputElement).value;

   // SIGN IN USER //
   signInWithEmailAndPassword(auth, accountEmailValue, passwordValue)
      .then((userCredential) => {
         // Signed in
         var user = userCredential.user;
         //window.location.href = "admin.html";
         // ...
      })
      .catch((error) => {
         var errorCode = error.code;
         var errorMessage = error.message;
         alert(errorMessage);
      });
}

// Get user data //
function getUserData() {
   var user = auth.currentUser;
   var name, email, photoUrl, uid, emailVerified;

   if (user != null) {
      name = user.displayName;
      email = user.email;
      photoUrl = user.photoURL;
      emailVerified = user.emailVerified;
      uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
   }

   (document.getElementById('testgetuser')! as HTMLElement).innerHTML = 'Name: ' + name + '<br>' + 'uid: ' + uid + '<br>';
   console.log(name);
   console.log(email);
   console.log(uid);
}

type Props = {
   loginFunction: () => void;
 };
 
export const Login = ({ loginFunction }: Props): JSX.Element => {
   return (
      <Box sx={{ margin: '1rem 1rem 1rem 1rem' }}>
         <Typography 
            variant='h1' 
            sx={{
               fontSize: {xs: "2rem", sm: "3rem", md: "4rem" },
               color: "black"}}>

            Logga in
            </Typography>

         <Typography 
            variant='h2' 
            sx= {{
               fontSize: {xs: "1rem", sm:"2rem", md: "3rem"}, 
               color: "black"}}>

            Endast för admin till webbsidan
            </Typography>

         <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}></Grid>
         </Grid>

         <Box sx={{ textAlign: 'center'}}>

         <form
         onSubmit={(e) => {
           e.preventDefault();
           loginFunction();
         }}
       >
         <Box sx={{ mb: 2 }}>
           <TextField
             id="accountemail"
             name="accountemail"
             label="Email"
             type="email"
             variant="outlined"
             
           />
         </Box>

         <Box sx={{ mb: 2 }}>
           <TextField
             id="pass"
             name="password"
             label="Password"
             type="password"
             variant="outlined"
           />
         </Box>

         <Button
           type="submit"
           variant="contained"
           color="primary"
           id="signin"
         >
           Sign in
         </Button>
       </form>
     </Box>
     <Typography variant="body2" sx={{ mt: 2 }}>
        Har du frågor eller vill ha adminbehörighet? Kontakta Erik
      </Typography>
    </Box>
  );
};