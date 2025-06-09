import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { DbContentProvider } from './contexts/DBContentContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import './index.css';
//import { BrowserRouter, Link, Route } from "react-router-dom"

const domNode = document.getElementById('root')!;
const root = createRoot(domNode);
// root.render(<App />);

root.render(
   <React.StrictMode>
      <HelmetProvider>
         <DbContentProvider>
            <SiteSettingsProvider>
               <AuthProvider>
                  <App />
               </AuthProvider>
            </SiteSettingsProvider>
         </DbContentProvider>
      </HelmetProvider>
   </React.StrictMode>
   //  document.getElementById('root')
);
