import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteSettingsData } from '../interfaces/SettingsInterfaces';
import { readAndWriteToFirebase } from '../utils/firebaseFunctions';
import { useDbContent } from './DBContentContext';

interface SiteSettingsContextValue {
   siteSettings: SiteSettingsData | null;
   loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
   siteSettings: null,
   loading: true,
});

export const useSiteSettings = () => useContext(SiteSettingsContext);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const { websiteID } = useDbContent();
   const [siteSettings, setSiteSettings] = useState<SiteSettingsData | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (!websiteID) return;
      const fetchSettings = async () => {
         const settings = await readAndWriteToFirebase({
            method: 'get',
            ref: `websites/${websiteID}/settings`,
         });
         setSiteSettings(settings ?? null);
         setLoading(false);

         if (settings) {
            // Inject styles
            if (settings.customCSS) {
               const styleTag = document.createElement('style');
               styleTag.innerHTML = settings.customCSS;
               document.head.appendChild(styleTag);
            }

            // Inject custom head HTML
            if (settings.customHTMLHead) {
               const headFrag = document.createRange().createContextualFragment(settings.customHTMLHead);
               document.head.appendChild(headFrag);
            }

            // Inject custom body HTML
            if (settings.customHTMLBodyEnd) {
               const bodyFrag = document.createRange().createContextualFragment(settings.customHTMLBodyEnd);
               document.body.appendChild(bodyFrag);
            }

            // Apply fonts/colors
            if (settings.font) document.body.style.fontFamily = settings.font;
            if (settings.textColor) document.body.style.color = settings.textColor;
            if (settings.primaryColor) {
               document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
            }
         }
      };

      fetchSettings();
   }, [websiteID]);

   return <SiteSettingsContext.Provider value={{ siteSettings, loading }}>{children}</SiteSettingsContext.Provider>;
};
