// alert('Dubbelkoll av Erik vid utveckling. Om rutan popar upp så funkar mitt javascript samt jquery.');
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './utils/firebase';

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

export const Login = (): JSX.Element => {
   return (
      <div style={{ margin: '1rem 1rem 1rem 1rem' }}>
         <h1>Logga in</h1>
         <h2>Endast för admin till webbsidan</h2>
         <br />
         <div style={{ textAlign: 'center' }}>
            <form>
               <label htmlFor="accountemail">Email:</label>
               <br />
               <input type="text" id="accountemail" name="accountemail" />
               <br />
               <br />
               <label htmlFor="pass">Password:</label>
               <br />
               <input type="password" id="pass" name="password" />
               <br />
               <br />
               {/* <button type="button" onclick="createUser()" id="createaccount">Create Account</button> */}
               <button type="button" onClick={loginFunction} id="signin">
                  Sign in
               </button>
               {/* <button type="button" onclick="getUserData()" id="getuserdata">See my data</button> */}
            </form>
         </div>
         <p>Har du frågor eller vill ha adminbehörighet? Kontakta Erik</p>
      </div>
   );
};
