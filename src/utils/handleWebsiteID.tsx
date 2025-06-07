import { child, ref as dbRef, get, push, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { DBWebsiteIdKey } from '../interfaces/dbInterfaces';
import { sectionTypes } from '../interfaces/sectionInterfaces';
import { db } from './firebase';
/* Does not work
async function uploadStandardImages() {
   let images = [mapImageExample, speakerImgExample1, speakerImgExample2, speakerImgExample3, fullScreenMediaExample1];
   images.forEach((image) => {
      console.log('image:' + image);
      const pitchCardRef = storageRef(storage, `/setupImages/${image}`);
      const base64String = image; // Base64 string
      const binaryString = btoa(base64String.split(',')[1]); // Binary data string
      const imageBlob = new Blob([binaryString], { type: 'image/jpg' }); // Create a BLOB object
      uploadBytes(pitchCardRef, imageBlob).then((snapshot) => {
         console.log('Uploaded a blob or file!');
         console.log('snapshot.ref.fullPath', snapshot.ref.fullPath);
         let startURL = devSettings === 'PRODUCTION' ? `gs://` : `http://127.0.0.1:9199/v0/b/`;
      });
   });
}
*/

async function createFirstTimeSections(websiteID: string) {
   let counter = 0;
   for (let section of sectionTypes) {
      let sectionOrder = section === 'footer' ? Object.keys(sectionTypes).length : counter++;
      let sectionID = push(child(dbRef(db), `websites/${websiteID}/homepageContent/`)).key;
      //await uploadStandardImages(); //Does not work
      await set(dbRef(db, `websites/${websiteID}/homepageContent/${sectionID}/`), {
         sectionName: section,
         //content: initSectionDataOnNewCreation[section as SectionTypes],
         sectionID: sectionID,
         sectionOrder: sectionOrder,
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString(),
      })
         .then(() => {
            console.log('New section created');
         })
         .catch((error) => {
            console.error(error);
         });
   }
}
async function createNewWebsiteID(thisLocationsHostName: string) {
   const isDev = thisLocationsHostName === 'localhost';

   if (isDev) {
      // Hårdkodat ID för localhost (eller annan dev hostname)
      const hardcodedID = '-DEV-LOCALHOST-ID';

      // Skriv in i DB om det inte finns sedan innan (så det finns en databaspost också)
      const ref = dbRef(db, 'websiteIds/' + hardcodedID);
      const snapshot = await get(ref);
      if (!snapshot.exists()) {
         await set(ref, {
            websiteHostName: thisLocationsHostName,
            websiteID: hardcodedID,
            created: new Date().toISOString(),
         });
         console.log('Hardcoded dev websiteID created in DB');
      }

      return hardcodedID;
   }
   //let newWebsiteID = uuidv4()
   let newWebsiteID = push(child(dbRef(db), 'websiteIds')).key;
   if (newWebsiteID === null) newWebsiteID = uuidv4();
   console.log('newWebsiteID', newWebsiteID);
   return await set(dbRef(db, 'websiteIds/' + newWebsiteID), {
      websiteHostName: thisLocationsHostName,
      websiteID: newWebsiteID,
      created: new Date().toISOString(),
   })
      .then(() => {
         console.log('New websiteID created');
         return newWebsiteID as string;
      })
      .catch((error) => {
         console.error(error);
         return '404 - Error (createNewWebsiteID)';
      });
}

export async function handleWebSiteID(): Promise<string> {
   let thisLocationsHostName = window.location.hostname;
   let websiteIDsRoot = dbRef(db, 'websiteIds/');
   return get(websiteIDsRoot)
      .then(async (snapshot) => {
         let websiteID = '';
         if (snapshot.exists() && snapshot.val()) {
            let data: DBWebsiteIdKey = snapshot.val();
            let arrayOfWebsiteIDs = Object.keys(data);
            for (let websiteIDInDB of arrayOfWebsiteIDs) {
               if (data[websiteIDInDB].websiteHostName === thisLocationsHostName) {
                  websiteID = websiteIDInDB;
                  console.log('websiteID in DB:', websiteIDInDB);
                  return websiteID;
               }
            }
            if (websiteID === '') {
               //If websiteID is still "" after loop, the hostname is not in DB, create new websiteID
               console.log('websiteIdsRooot exis but not an ID for this hostname, creating new websit');
               let newWebsiteID = await createNewWebsiteID(thisLocationsHostName);
               return newWebsiteID;
            }

            return websiteID;
         } else {
            console.log('No data available,  creating new websiteID');

            let newWebsiteID = await createNewWebsiteID(thisLocationsHostName);
            //await createFirstTimeSections(newWebsiteID);
            return newWebsiteID;
         }
      })
      .catch((error) => {
         console.log('Error getting websiteIds:', error, 'handleWebSiteID');
         return '';
      });
}
