import { onValue, ref } from 'firebase/database';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { DBCustomPages, PageMetadata } from '../interfaces/dbInterfaces';
import { SectionContent, SectionIDs } from '../interfaces/sectionInterfaces';
import { db } from '../utils/firebase';
import { handleWebSiteID } from '../utils/handleWebsiteID';

interface DbContentContextType {
   websiteID: string;
   homepageContent: SectionContent[];
   setHomepageContent: React.Dispatch<React.SetStateAction<SectionContent[]>>;
   customPages: Record<string, SectionContent[]>;
   setCustomPages: React.Dispatch<React.SetStateAction<Record<string, SectionContent[]>>>;
   setCustomPagesMetaData: React.Dispatch<React.SetStateAction<PageMetadata[]>>; // new!
   customPageMetaData: PageMetadata[]; // new!
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
   const [customPageMetaData, setCustomPagesMetaData] = useState<PageMetadata[]>([]); // new!
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
         if (!pages) {
            setCustomPages({});
            setCustomPagesMetaData([]);
            return;
         }

         const parsedPages: Record<string, SectionContent[]> = {};
         const navLinks: PageMetadata[] = [];

         Object.entries(pages).forEach(([pageID, data]) => {
            const { metadata, content } = data as DBCustomPages;
            if (!metadata || !content) return;

            const sectionArray = Object.values(content).sort((a, b) => a.sectionOrder - b.sectionOrder);
            parsedPages[pageID] = sectionArray;

            navLinks.push(metadata);
         });

         setCustomPages(parsedPages);
         setCustomPagesMetaData(navLinks);
      });

      return () => unsubscribe();
   }, [websiteID]);

   return (
      <DbContentContext.Provider
         value={{
            websiteID,
            homepageContent,
            customPageMetaData,
            setCustomPagesMetaData,
            setHomepageContent,
            setCustomPages,
            customPages,
            isLoading,
         }}
      >
         {children}
      </DbContentContext.Provider>
   );
};
