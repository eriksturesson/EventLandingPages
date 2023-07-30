import React, { useEffect, useState } from 'react';

import { getDatabase, ref, set, onValue, child, get } from 'firebase/database';
import { db } from './utils/firebase';
import { DBFullScreenMedia, DBHomePageContent, DBSpeaker, DBSpeakersKey } from './interfaces/dbInterfaces';
import { SectionIDs } from './interfaces/sectionInterfaces';
import { SectionLoader } from '../SectionLoader';

import TestImage from '../assets/DSC02755.JPG';

function testonload() {
   alert('testar onload i html-filen, då ska denna funktion köras');
}

export const initialState: SectionIDs = {
   uionsgrngnen: {
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
   ugois8934ifre: {
      sectionName: 'speakers',
      id: 'ugois8934ifre',
      order: '0',
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      content: {
         geshfnoesriasf: {
            speakerName: 'Test Testsson',
            speakerDescription: 'This speaker is sooo awesome!',
            speakerImage: TestImage,
            speakerPitch: 'I am such a good speaker.',
            speakerTitle: 'Hero Speaker',
            speakerTitleDescription: 'In how many ways do I need to say this?',
            speakerID: '098432oh432432ij432',
         } as DBSpeaker,
      } as DBSpeakersKey,
   },
   lk45lköölkölk: {
      sectionName: 'footer',
      id: '5ölk45ölköl',
      order: '0',
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      content: {
         integrityPolicy: 'integrityPolicy',
         integrityPolicyDescription:
            'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum debitis pariatur minus saepe ullam labore quo corrupti tempore eius rem hic repellendus provident beatae, quas laudantium! Fuga aut rerum cupiditate!',
         contactName: 'contactName',
         contactEmail: 'contactEmail',
         contactPhone: 'contactPhone',
         adressTitle: 'adressTitle',
         contactTitle: 'contactTitle',
         contactAddress1: 'contactAddress1',
         contactAddress2: 'contactAddress2',
         mapImage: 'mapImage', // url to storage
      },
   },
};

const Home = ({ websiteID }: { websiteID: string }): JSX.Element => {
   const [homepageContent, setProgramContent] = useState<SectionIDs>(initialState);
   let page = window.location.href;
   //let databaseContent = document.getElementByClassName('DBContent');
   useEffect(() => {
      // READ DATA WHEN UPDATED TO UPDATE PROGRAM CONTENT
      let readContentFromDatabaseToIndex = ref(db, `websites/${websiteID}/homepageContent`);

      onValue(readContentFromDatabaseToIndex, (snapshot) => {
         let programContentFromDB: SectionIDs = snapshot.val() ? snapshot.val() : '';

         if (!programContentFromDB) return;

         setProgramContent(programContentFromDB);
      });
   }, []);

   return <SectionLoader adminEditor={false} data={homepageContent} />;
};

export default Home;
