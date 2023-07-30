import { ref as dbRef, get, set, push, child } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { db, devSettings, storage } from './firebase';
import { DBWebsiteIDs } from '../interfaces/dbInterfaces';
import { SectionTypes, sectionTypes } from '../interfaces/sectionInterfaces';
import { initSectionDataOnNewCreation } from './initData';
import { WEBSITE_ID } from '../../App';
import {
   mapImageExample,
   speakerImgExample1,
   speakerImgExample2,
   speakerImgExample3,
   fullScreenMediaExample1,
} from '../../assets/index';
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
   for (let section of sectionTypes) {
      let sectionID = push(child(dbRef(db), `websites/${websiteID}/homepageContent/`)).key;
      //await uploadStandardImages(); //Does not work
      await set(dbRef(db, `websites/${websiteID}/homepageContent/${sectionID}/`), {
         sectionName: section,
         content: initSectionDataOnNewCreation[section],
         sectionID: sectionID,
         sectionOrder: sectionTypes.indexOf(section),
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
            console.log(snapshot.val());
            let data: DBWebsiteIDs = snapshot.val();
            let arrayOfWebsiteIDs = Object.keys(data);
            for (let websiteIDInDB of arrayOfWebsiteIDs) {
               if (data[websiteIDInDB].websiteHostName === thisLocationsHostName) {
                  websiteID = websiteIDInDB;
                  console.log(websiteIDInDB, 'websiteIDInDB');
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
            await createFirstTimeSections(newWebsiteID);
            return newWebsiteID;
         }
      })
      .catch((error) => {
         console.log('Error getting websiteIds:', error, 'handleWebSiteID');
         return '';
      });
}
