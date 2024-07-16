import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
//import { BrowserRouter, Link, Route } from "react-router-dom"

const domNode = document.getElementById('root')!;
const root = createRoot(domNode);
// root.render(<App />);

root.render(
   <React.StrictMode>
      <App />
   </React.StrictMode>
   //  document.getElementById('root')
);
