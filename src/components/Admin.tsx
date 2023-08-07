import React, { useEffect, useState } from 'react';
import { db } from './utils/firebase';
import { Database, ref, onValue, set } from 'firebase/database';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './utils/firebase';
import ReactQuill, { Quill } from 'react-quill';
import { QuillComponent } from './sections/Quill';
import Home from './Home';
import Button from '@mui/material/Button';
import { TextareaAutosize } from '@mui/base';
import NavWrapper from './NavWrapper';
import { Footer } from './sections/Footer';
import {
   DB,
   DBFullScreenMedia,
   DBHomePageContent,
   DBHomePageContentButton,
   DBHomePageContentFooter,
   DBOrganizersKey,
   DBParticipantKey,
   DBPitchCardKey,
   DBSpeakersKey,
   QuillContent,
} from './interfaces/dbInterfaces';
import { Box } from '@mui/material';
import { PitchCardsComponent } from './sections/PitchCards';
import { HeaderComponent } from './sections/ImageVideoSection/Header';
import { OrganizersComponent } from './sections/Organizers';
import { SectionContent, SectionIDs } from './interfaces/sectionInterfaces';
import { initialState } from './utils/initData';
import { SectionLoader } from '../SectionLoader';
import { LoadingSpinner } from './Loading';
// Get user data //

var name, email: string | null, photoUrl, uid: string, emailVerified;

function signOutUser() {
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

/* EDIT TEXT FROM ADMIN */

/* One function for all elements to edit textContent */

let currentTextToEdit = '';
let newTextContent = '';

function editTextContent(edit_id: string, showing_id: string) {
   // I need the ID of input-field named the same but without "button" in the beginning
   const str = String(edit_id);
   const inputID = str.replace('button', '');

   const currentInner = (document.getElementById(showing_id) as HTMLElement).innerHTML;
   const currentOuter = (document.getElementById(showing_id) as HTMLElement).outerHTML;

   if (currentInner.includes('strong')) {
      let currentTextToEdit = (document.getElementById(inputID) as HTMLInputElement).value;
      (document.getElementById(showing_id) as HTMLElement).innerHTML = '<strong>' + currentTextToEdit + '</stong>';
      console.log(currentTextToEdit);
   } else if (currentOuter.includes('</p>')) {
      let currentTextToEdit = (document.getElementById(inputID) as HTMLInputElement).value;
      (document.getElementById(showing_id) as HTMLElement).innerHTML = '"' + currentTextToEdit + '"';
      console.log(currentTextToEdit);
   } else {
      let currentTextToEdit = (document.getElementById(inputID) as HTMLInputElement).value;
      (document.getElementById(showing_id) as HTMLElement).innerHTML = currentTextToEdit;
      console.log(currentTextToEdit);
   }
}

// SAVE TO DATABASE

function saveDataToFirebase() {
   let adminJSTextContent = (document.getElementById('adminTextContent') as HTMLElement).innerHTML;
   console.log(adminJSTextContent);

   let currentdate = new Date();
   let timeSavedData =
      currentdate.getFullYear() +
      '-' +
      currentdate.getMonth() +
      '-' +
      currentdate.getDate() +
      ':' +
      currentdate.getHours() +
      ':' +
      currentdate.getMinutes() +
      ':' +
      currentdate.getSeconds();

   console.log(timeSavedData);

   // Insert text to database
   set(ref(db, 'Program'), {
      ProgramContent: adminJSTextContent,
      Timestamp: timeSavedData,
   });

   // Insert log to database //
   set(ref(db, 'users/' + uid), {
      Email: email,
      LastTimeSavedData: timeSavedData,
   });
}

function loadDBContent(): JSX.Element {
   // READ DATA WHEN UPDATED TO UPDATE INDEX.HTML PROGRAM CONTENT

   let readContentFromDatabaseRef = ref(db, 'Program/ProgramContent');
   let updateAdminWebsiteContent = document.getElementById('readDatabaseContentForAdmin');
   //let databaseContent = document.getElementByClassName('DBContent');
   let data: string = '';
   //if ((document.getElementById("firstProgramHeader") as HTMLInputElement).value == undefined) {
   onValue(readContentFromDatabaseRef, (snapshot) => {
      data = snapshot.val();
      if (data !== null) {
         return <>{data}</>;
         //(document.getElementById("adminTextContent") as HTMLElement).innerHTML = data;
         // let databaseContent = document.getElementByClassName('DBContent')[0].innerHTML = data;
         // console.log(databaseContent);
      } else {
         //alert('There is no text to get');
         return <>{data}</>;
      }
   });
   return <>{data}</>;
   //}
}

export const Admin = ({ user, websiteID }: { user: User | null; websiteID: string }): JSX.Element => {
   const [homepageContent, setProgramContent] = useState<SectionIDs | null>(null);
   //let databaseContent = document.getElementByClassName('DBContent');
   useEffect(() => {
      // READ DATA WHEN UPDATED TO UPDATE INDEX.HTML PROGRAM CONTENT
      let readContentFromDatabaseToIndex = ref(db, `websites/${websiteID}/homepageContent`);
      onValue(readContentFromDatabaseToIndex, (snapshot) => {
         let programContentFromDB: SectionIDs = snapshot.val() ? snapshot.val() : '';

         if (!programContentFromDB) return setProgramContent(initialState);

         if (programContentFromDB) setProgramContent(programContentFromDB);
      });
   }, []);

   if (!homepageContent) return <LoadingSpinner />;

   return (
      <>
         <form>
            <Button variant="outlined" onClick={signOutUser} id="signout">
               Sign out
            </Button>
         </form>
         <h1>Redigera program, talare och tider</h1>
         <p>UserEmail: {user ? user.email : null}</p>
         <br />
         <Box className="adminEdit" id="adminEditWrapper">
            <SectionLoader data={homepageContent} adminEditor={true} />
         </Box>
         <Box>
            <h1>Detta syns nu på webbsidan:</h1>
         </Box>
         <Box id="readDatabaseContentForAdmin" className="DBContent">
            <NavWrapper websiteID={websiteID} />
            <SectionLoader data={homepageContent} adminEditor={false} />
         </Box>
      </>
   );
};
