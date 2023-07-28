import { ref, get, set, push, child } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { db } from './firebase';
import { DBWebsitesIDs } from './dbInterfaces';

async function createNewWebsiteID(thisLocationsHostName: string) {
   //let newWebsiteID = uuidv4()
   let newWebsiteID = push(child(ref(db), 'websitesIds')).key;
   if (newWebsiteID === null) newWebsiteID = uuidv4();
   console.log('newWebsiteID', newWebsiteID);
   return await set(ref(db, 'websitesIds/' + newWebsiteID), {
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
   let websiteIDsRoot = ref(db, 'websitesIds/');
   return get(websiteIDsRoot)
      .then(async (snapshot) => {
         let websiteID = '';
         if (snapshot.exists() && snapshot.val()) {
            console.log(snapshot.val());
            let data: DBWebsitesIDs = snapshot.val();
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
            return newWebsiteID;
         }
      })
      .catch((error) => {
         console.log('Error getting websitesIds:', error, 'handleWebSiteID');
         return '';
      });
}
