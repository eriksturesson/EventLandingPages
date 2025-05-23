//import logo from './logo.svg';
import { User, onAuthStateChanged } from 'firebase/auth';
import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import './App.css';

import Admin from './components/Admin';
import ArrangerandeKlubbar from './components/ArrangerandeKlubbar';
import Home from './components/Home';
import { LoadingSpinner } from './components/Loading';
import { Login } from './components/Login';
import NavWrapper from './components/NavWrapper';
import TidigareProgram from './components/TidigareProgram';
import { SectionContent, SectionIDs } from './components/interfaces/sectionInterfaces';
import { auth, db } from './components/utils/firebase';
import { handleWebSiteID } from './components/utils/handleWebsiteID';
export let WEBSITE_ID = '';
const App = (): JSX.Element => {
   const [logedIn, setLogedIn] = useState<boolean | null>(null);
   const [websiteID, setWebsiteID] = useState<string>('');
   const [homepageContent, setProgramContent] = useState<SectionContent[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(true);
   WEBSITE_ID = websiteID;
   //const [websiteID, setWebsiteID] = useState<string | null>(null)
   let userOrNull: User | null = auth.currentUser;
   useEffect(() => {
      const listener = onAuthStateChanged(auth, async (user) => {
         if (user) {
            userOrNull = user;
            setLogedIn(true);
         } else setLogedIn(false);
      });
      return () => {
         listener();
      };
   }, []);

   useEffect(() => {
      handleWebSiteID().then((id) => {
         setWebsiteID(id);
      });
   }, []);
   useEffect(() => {
      let readContentFromDatabaseToIndex = ref(db, `websites/${websiteID}/homepageContent`);
      onValue(readContentFromDatabaseToIndex, (snapshot) => {
         let programContentFromDB: SectionIDs = snapshot.val() ? snapshot.val() : '';
         if (!programContentFromDB) return setProgramContent([]);
         let programContentArray = Object.values(programContentFromDB);
         programContentArray.sort((a, b) => a.sectionOrder - b.sectionOrder);
         setProgramContent(programContentArray);
      });
   }, [websiteID]); // Listen for changes in websiteID

   if (websiteID === '' || logedIn === null) return <LoadingSpinner />;

   let page = window.location.href;

   if (page.includes('tidigareprogram')) {
      return (
         <>
            <NavWrapper websiteID={websiteID} />
            <TidigareProgram />
         </>
      );
   } else if (page.includes('arrangerandeklubbar')) {
      return (
         <>
            <NavWrapper websiteID={websiteID} />
            <ArrangerandeKlubbar />
         </>
      );
   } else if (page.includes('admin') || page.includes('login')) {
      let element: JSX.Element = logedIn ? (
         <Admin homepageContent={homepageContent} setHomepageContent={setProgramContent} user={userOrNull} />
      ) : (
         <Login />
      );
      return element;
   } else {
      return (
         <>
            <NavWrapper websiteID={websiteID} />
            <Home homepageContent={homepageContent} />
         </>
      );
   }
};

export default App;
