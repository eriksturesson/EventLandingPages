import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Admin from './components/Admin';
import CreateAdmin from './components/CreateAdmin';
import CustomPage from './components/CustomPage';
import Home from './components/Home';
import { LoadingSpinner } from './components/Loading';
import { useDbContent } from './contexts/DBContentContext';
import { useSiteSettings } from './contexts/SiteSettingsContext';
import { applySiteSettings } from './utils/applySiteSettings';

const App = (): JSX.Element => {
   const { siteSettings, loading } = useSiteSettings();
   const { customPageMetaData } = useDbContent();

   useEffect(() => {
      if (siteSettings) {
         applySiteSettings(siteSettings);
      }
   }, [siteSettings]);

   if (loading) return <LoadingSpinner />;

   return (
      <Router>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/create-admin" element={<CreateAdmin />} />
            {/* Dynamiska custom pages */}
            {customPageMetaData.map((page) => (
               <Route key={page.pageID} path={`/${page.pageLink}`} element={<CustomPage pageID={page.pageID} />} />
            ))}
         </Routes>
      </Router>
   );
};

export default App;
