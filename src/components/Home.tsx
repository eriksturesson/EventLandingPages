import React, { useEffect, useState } from 'react';

import { getDatabase, ref, set, onValue, child, get } from 'firebase/database';
import { db } from './utils/firebase';
import { DBFullScreenMedia, DBHomePageContent, DBSpeaker, DBSpeakersKey } from './interfaces/dbInterfaces';
import { SectionIDs } from './interfaces/sectionInterfaces';
import { SectionLoader } from '../SectionLoader';
import { initialState } from './utils/initData';

function testonload() {
   alert('testar onload i html-filen, då ska denna funktion köras');
}

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
