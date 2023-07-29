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
import { EditRegisterButtonComponent } from './sections/RegisterButton';
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
   QuillObject,
} from './interfaces/dbInterfaces';
import { Box } from '@mui/material';
import { PitchCardsComponent } from './sections/PitchCards';
import { HeaderComponent } from './sections/Header';
import { OrganizersComponent } from './sections/Organizers';
import { SectionContent, SectionIDs } from './interfaces/sectionInterfaces';
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

// Temporary initialState while implementing Sections in Home.tsx
interface DBWebsiteHomePageContent {
   fullScreenMedia: SectionContent;
   speakers: DBSpeakersKey;
   participants: DBParticipantKey;
   organizers: DBOrganizersKey;
   pitchCards: DBPitchCardKey;
   quillContent: string;
   button: DBHomePageContentButton;
   footer: DBHomePageContentFooter;
   timestamp: string;
}
const initialState: DBWebsiteHomePageContent = {
   fullScreenMedia: {
      id: 'uionsgrngnen',
      sectionName: 'fullScreenMedia',
      order: '0',
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      content: {
         logo: '',
         video: '',
         image: '',
      } as DBFullScreenMedia,
   },
   speakers: {},
   participants: {
      title: 'Deltagare',
   },
   organizers: {
      title: 'Arrangörer',
   },
   pitchCards: {
      myHardodedKey: {
         image: '', // url to storage
         title: '',
         description: '',
         order: 0,
         id: 'randomKey',
      },
   },
   quillContent: '',
   button: {
      formLink: "link to form here (use 'https://' to link outside the webpage)",
      buttonText: 'initial text',
      buttonInfo: 'inital info',
      buttonColor: 'green',
   },
   footer: {
      integrityPolicy: '',
      integrityPolicyDescription: '',
      contactTitle: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      adressTitle: '',
      contactAddress1: '',
      contactAddress2: '',
      mapImage: '',
   },
   timestamp: '',
};

export const Admin = ({ user, websiteID }: { user: User | null; websiteID: string }): JSX.Element => {
   const [homepageContent, setProgramContent] = useState<DBWebsiteHomePageContent>(initialState);
   //let databaseContent = document.getElementByClassName('DBContent');
   useEffect(() => {
      // READ DATA WHEN UPDATED TO UPDATE INDEX.HTML PROGRAM CONTENT
      let readContentFromDatabaseToIndex = ref(db, `websites/${websiteID}/homepageContent`);
      onValue(readContentFromDatabaseToIndex, (snapshot) => {
         let programContentFromDB: DBWebsiteHomePageContent = snapshot.val() ? snapshot.val() : '';
         if (programContentFromDB) setProgramContent(programContentFromDB);
      });
   }, [homepageContent]);

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
            <Box id="changeOrCreateNewPageToEdit"></Box>

            <Box id="editRegisterButton">
               <EditRegisterButtonComponent
                  sectionID={'wontWorkButtonSectionID'}
                  buttonContent={homepageContent.button}
                  websiteID={websiteID}
               />
            </Box>
            <Box id="editHeader">
               <HeaderComponent adminEditor={true} data={homepageContent.fullScreenMedia} />
            </Box>
            <Box id="editPitchCards" alignContent={'center'}>
               <PitchCardsComponent
                  sectionID={'wontWorkPitchCardSectionID'}
                  adminEditor={true}
                  pitchCardsDB={homepageContent.pitchCards}
               />
            </Box>
            <Box id="speakers">{/*Box for speaker(s) at the event*/}</Box>
            <Box id="participants" alignContent={'center'}>
               {/*Box for participants / organizers etc at the event*/}
            </Box>
            <Box id="myQuillComponent">
               <QuillComponent
                  sectionID={'wontWorkQuillSectionID'}
                  websiteID={websiteID}
                  quillContent={homepageContent.quillContent}
               />
            </Box>
            <Box id="organizers">
               <OrganizersComponent organizers={homepageContent.organizers} />
            </Box>
            <Box id="editFooter">
               <Footer footerContent={homepageContent.footer} />
            </Box>
         </Box>
         <Box>
            <h1>Detta syns nu på webbsidan:</h1>
         </Box>
         <Box id="readDatabaseContentForAdmin" className="DBContent">
            <NavWrapper websiteID={websiteID} />
            <Home websiteID={websiteID} />
         </Box>
      </>
   );
};
