import React, { useEffect, useState } from 'react';
import visningsbild1 from '../assets/DSC01125.JPG';
import visningsbild2 from '../assets/DSC01286.JPG';
import visningsbild3 from '../assets/DSC02755.JPG';
import rotaryLogo from '../assets/Logga stockholm city affarsnatverk 2020-12-28.png';
import rotaryVideomp4 from '../assets/VideoStockholmCityAffarsnatverk_Trim_min.mp4';
import rotaryVideoWebm from '../assets/VideoStockholmCityAffarsnatverk_Trim_min.webm';
import { getDatabase, ref, set, onValue, child, get } from 'firebase/database';
import { db } from './utilsAndInterfaces/firebase';
import { RegisterButtonComponent } from './RegisterButton';
import { HeaderComponent } from './Header';
import { PitchCardsComponent } from './PitchCards';
import { DBWebsiteHomePageContent } from './utilsAndInterfaces/interfaces';
import { QuillComponent, ShowQuillContent } from './Quill';
import { SpeakersComponent } from './Speakers';
import { ParticipantComponent } from './Participants';
import { OrganizersComponent } from './Organizers';
import { Footer } from './Footer';
import { ScheduleComponent } from './Schedule';

function testonload() {
   alert('testar onload i html-filen, då ska denna funktion köras');
}

export const initialState: DBWebsiteHomePageContent = {
   header: {
      logo: '',
      video: '',
      image: '',
   },
   speakers: {},
   participants: {
      title: 'Deltagare',
   },
   eventSchedule: {
      scheduleName: 'Kvällens upplägg',
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

const Home = ({ websiteID }: { websiteID: string }): JSX.Element => {
   const [homepageContent, setProgramContent] = useState<DBWebsiteHomePageContent>(initialState);
   //let databaseContent = document.getElementByClassName('DBContent');
   useEffect(() => {
      // READ DATA WHEN UPDATED TO UPDATE PROGRAM CONTENT
      let readContentFromDatabaseToIndex = ref(db, `websites/${websiteID}/homepageContent`);

      onValue(readContentFromDatabaseToIndex, (snapshot) => {
         let programContentFromDB: DBWebsiteHomePageContent = snapshot.val() ? snapshot.val() : '';
         setProgramContent(programContentFromDB);
      });
   }, []);
   return (
      <div>
         <HeaderComponent header={homepageContent.header} />
         <RegisterButtonComponent buttonContent={homepageContent.button} />
         <PitchCardsComponent pitchCardsDB={homepageContent.pitchCards} />
         <SpeakersComponent DBSpeakers={homepageContent.speakers} />
         <ScheduleComponent schedule={homepageContent.eventSchedule} />
         <ShowQuillContent quillContent={homepageContent.quillContent} />
         <ParticipantComponent participants={homepageContent.participants} />
         <OrganizersComponent organizers={homepageContent.organizers} />
         <RegisterButtonComponent buttonContent={homepageContent.button} />
         <Footer footerContent={homepageContent.footer} />
      </div>
   );
};

export default Home;
