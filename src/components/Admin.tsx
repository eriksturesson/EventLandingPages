import React, { useEffect, useState } from 'react';
import { db } from './utils/firebase';
import { ref, onValue, set } from 'firebase/database';
import { User, signOut } from 'firebase/auth';
import { auth } from './utils/firebase';
import Button from '@mui/material/Button';
import NavWrapper from './NavWrapper';
import { Box, Grid, Stack } from '@mui/material';
import { SectionContent, SectionIDs } from './interfaces/sectionInterfaces';
import { initialState } from './utils/initData';
import { SectionLoader } from '../SectionLoader';
import { LoadingSpinner } from './Loading';
import SectionNavigator from './SectionNavigator';
import { CreateSection } from './smallComponents/CreateSection';
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

export const Admin = ({
   user,
   homepageContent,
   setHomepageContent,
}: {
   user: User | null;
   homepageContent: SectionIDs;
   setHomepageContent: any;
}): JSX.Element => {
   const handleDrop = async (event: React.DragEvent<HTMLDivElement>, sections: SectionContent[]) => {
      const droppedIndex = +event.dataTransfer.getData('section-order');
      let targetIndex = +((event.target as HTMLElement).dataset.order as string);

      if (droppedIndex === targetIndex) return console.log('nope not here');

      // const droppedIndex = sections.findIndex((section) => section.sectionID === droppedId);
      // targetIndex
      // const newSections = [...sections];
      let newSections = JSON.parse(JSON.stringify(sections)) as SectionContent[];

      const droppedItem = newSections.splice(droppedIndex, 1);
      // console.log('dropped item', droppedItem);
      // console.log('array, removed dropped item', newSections);

      // console.log('slice 1', newSections.slice(0, targetIndex));
      // console.log(
      //    'slice 2',
      //    newSections.slice(targetIndex === newSections.length ? targetIndex - 1 : targetIndex, newSections.length)
      // );

      // console.log('targetIndex', targetIndex);
      // console.log('newSections.length', newSections.length);

      if (targetIndex === newSections.length || droppedIndex < targetIndex) targetIndex = targetIndex - 1;

      // targetIndex = targetIndex === newSections.length ? targetIndex - 1 : targetIndex;
      // targetIndex = droppedIndex < targetIndex ? targetIndex - 1 : targetIndex;

      let newNewSections = [
         ...newSections.slice(0, targetIndex),
         ...droppedItem,
         ...newSections.slice(targetIndex, newSections.length),
      ];

      console.log("after slice n' splice", newNewSections);

      newNewSections = newNewSections.map((item, i) => {
         item.sectionOrder = i;
         return item;
      });

      // newSections.map((a) => JSON.parse(JSON.stringify(a)));

      // if (droppedIndex > targetIndex) {
      //    newSections[targetIndex].sectionOrder = targetIndex;
      //    newSections[droppedIndex].sectionOrder = targetIndex - 1;
      //    newSections.map(() => 'a');

      //    console.log(newSections);
      // }

      // if (droppedIndex < targetIndex) {
      //    newSections[targetIndex].sectionOrder = targetIndex;
      //    newSections[droppedIndex].sectionOrder = targetIndex - 1;
      // }

      // newSections.sort((a, b) => a.sectionOrder - b.sectionOrder);

      console.log('after map', newNewSections);

      const pageContent: SectionIDs = {};

      newNewSections.forEach((item) => {
         pageContent[item.sectionID] = item;
      });

      console.log('pagecontent row 209', pageContent);

      setHomepageContent(pageContent);

      console.log('dropping', droppedIndex, 'on', targetIndex);
   };

   return (
      <>
         <Grid container>
            <SectionNavigator
               sections={Object.values(homepageContent).sort((a, b) => a.sectionOrder - b.sectionOrder)}
               handleDrop={handleDrop}
            />
            <Grid item xs={9}>
               <form>
                  <Button variant="outlined" onClick={signOutUser} id="signout">
                     Sign out
                  </Button>
               </form>
               <h1>Redigera program, talare och tider</h1>
               <p>UserEmail: {user ? user.email : null}</p>
               <br />
               <Box className="adminEdit" id="adminEditWrapper" sx={{ transform: 'scale(1)', transformOrigin: '0% 0% 0px' }}>
                  {Object.keys(homepageContent).length > 0 ? (
                     <SectionLoader data={homepageContent} adminEditor={true} />
                  ) : null}
               </Box>
               {Object.keys(homepageContent).length === 0 ? <CreateSection sectionOrder={0} /> : null}
            </Grid>
         </Grid>
         {/*          <Box>
            <h1>Detta syns nu på webbsidan:</h1>
         </Box>
         <Box id="readDatabaseContentForAdmin" className="DBContent">
            <NavWrapper websiteID={websiteID} />
            <SectionLoader data={homepageContent} adminEditor={false} />
         </Box> */}
      </>
   );
};
