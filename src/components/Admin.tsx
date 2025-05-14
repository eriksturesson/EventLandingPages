import { Box, Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { User, signOut } from 'firebase/auth';
import { onValue, ref, set } from 'firebase/database';
import React from 'react';
import { SectionLoader } from '../SectionLoader';
import { SectionContent, SectionIDs } from './interfaces/sectionInterfaces';
import SectionNavigator from './SectionNavigator';
import { CreateSection } from './smallComponents/CreateSection';
import { auth, db } from './utils/firebase';
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
      const targetEl = (event.target as HTMLElement).closest('[data-order]');
      const targetIndexRaw = targetEl ? +targetEl.getAttribute('data-order')! : -1;

      if (droppedIndex === targetIndexRaw || targetIndexRaw === -1) return;

      let targetIndex = targetIndexRaw;
      const newSections = JSON.parse(JSON.stringify(sections)) as SectionContent[];

      const droppedItem = newSections.splice(droppedIndex, 1);

      if (targetIndex === newSections.length || droppedIndex < targetIndex) {
         targetIndex -= 1;
      }

      const reordered = [...newSections.slice(0, targetIndex), ...droppedItem, ...newSections.slice(targetIndex)].map(
         (item, index) => ({ ...item, sectionOrder: index })
      );

      const pageContent: SectionIDs = {};
      reordered.forEach((item) => {
         pageContent[item.sectionID] = item;
      });

      setHomepageContent(pageContent);
   };

   const orderedSections = Object.values(homepageContent).sort((a, b) => a.sectionOrder - b.sectionOrder);

   return (
      <Box sx={{ textAlign: 'center', contentAlign: 'center' }}>
         <Grid container>
            <SectionNavigator sections={orderedSections} handleDrop={handleDrop} />
            <Grid item xs={9}>
               <form>
                  <Button variant="outlined" onClick={signOutUser} id="signout">
                     Sign out
                  </Button>
               </form>
               <Typography variant="h3">Redigera program, talare och tider</Typography>
               <Typography variant="body1">UserEmail: {user ? user.email : null}</Typography>

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
      </Box>
   );
};
