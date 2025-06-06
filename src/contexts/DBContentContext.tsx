import { onValue, ref } from 'firebase/database';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SectionContent, SectionIDs } from '../components/interfaces/sectionInterfaces';
import { db } from '../components/utils/firebase';
import { handleWebSiteID } from '../components/utils/handleWebsiteID';

interface DbContentContextType {
   websiteID: string;
   homepageContent: SectionContent[];
   setHomepageContent: React.Dispatch<React.SetStateAction<SectionContent[]>>;
   customPages: Record<string, SectionContent[]>;
   isLoading: boolean;
}

const DbContentContext = createContext<DbContentContextType | undefined>(undefined);

export const useDbContent = (): DbContentContextType => {
   const context = useContext(DbContentContext);
   if (!context) throw new Error('useDbContent must be used within DbContentProvider');
   return context;
};

export const DbContentProvider = ({ children }: { children: React.ReactNode }) => {
   const [websiteID, setWebsiteID] = useState<string>('');
   const [homepageContent, setHomepageContent] = useState<SectionContent[]>([]);
   const [customPages, setCustomPages] = useState<Record<string, SectionContent[]>>({});
   const [isLoading, setIsLoading] = useState<boolean>(true);

   // Website ID loader
   useEffect(() => {
      const init = async () => {
         const id = await handleWebSiteID();
         setWebsiteID(id);
      };
      init();
   }, []);

   // Homepage content listener
   useEffect(() => {
      if (!websiteID) return;

      const contentRef = ref(db, `websites/${websiteID}/homepageContent`);
      const unsubscribe = onValue(contentRef, (snapshot) => {
         const data = snapshot.val() as SectionIDs | null;
         if (!data) {
            setHomepageContent([]);
         } else {
            const array = Object.values(data);
            array.sort((a, b) => a.sectionOrder - b.sectionOrder);
            setHomepageContent(array);
         }
         setIsLoading(false);
      });

      return () => unsubscribe();
   }, [websiteID]);

   // Custom pages listener
   useEffect(() => {
      if (!websiteID) return;

      const customPagesRef = ref(db, `websites/${websiteID}/customPages`);
      const unsubscribe = onValue(customPagesRef, (snapshot) => {
         const pages = snapshot.val();
         if (!pages) return setCustomPages({});

         const parsedPages: Record<string, SectionContent[]> = {};

         Object.entries(pages).forEach(([pageID, content]) => {
            const sectionArray = Object.values(content as SectionIDs).sort((a, b) => a.sectionOrder - b.sectionOrder);
            parsedPages[pageID] = sectionArray;
         });

         setCustomPages(parsedPages);
      });

      return () => unsubscribe();
   }, [websiteID]);

   return (
      <DbContentContext.Provider value={{ websiteID, homepageContent, setHomepageContent, customPages, isLoading }}>
         {children}
      </DbContentContext.Provider>
   );
};
