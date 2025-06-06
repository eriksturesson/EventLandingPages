import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { DbContentProvider } from './contexts/DBContentContext';
import './index.css';
//import { BrowserRouter, Link, Route } from "react-router-dom"

const domNode = document.getElementById('root')!;
const root = createRoot(domNode);
// root.render(<App />);

root.render(
   <React.StrictMode>
      <DbContentProvider>
         <AuthProvider>
            <App />
         </AuthProvider>
      </DbContentProvider>
   </React.StrictMode>
   //  document.getElementById('root')
);
