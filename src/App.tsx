//import logo from './logo.svg';
import { useEffect } from 'react';
import './App.css';
import Admin from './components/Admin';
import ArrangerandeKlubbar from './components/ArrangerandeKlubbar';
import Home from './components/Home';
import { LoadingSpinner } from './components/Loading';
import TidigareProgram from './components/TidigareProgram';
import { useSiteSettings } from './contexts/SiteSettingsContext';
import { applySiteSettings } from './utils/applySiteSettings';

const App = (): JSX.Element => {
   const { siteSettings, loading } = useSiteSettings();

   useEffect(() => {
      if (siteSettings) {
         applySiteSettings(siteSettings);
      }
   }, [siteSettings]);
   if (loading) return <LoadingSpinner />;
   const page = window.location.href;

   if (page.includes('tidigareprogram')) return <TidigareProgram isAdmin={false} />;
   if (page.includes('arrangerandeklubbar')) return <ArrangerandeKlubbar isAdmin={false} />;
   if (page.includes('admin') || page.includes('login')) return <Admin />;
   return <Home />;
};

export default App;
