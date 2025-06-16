import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import {
   Box,
   Button,
   Divider,
   Drawer,
   IconButton,
   List,
   ListItem,
   ListItemText,
   IconButton as MUIButton,
   Paper,
   Typography,
   useMediaQuery,
   useTheme,
} from '@mui/material';
import React, { useState } from 'react';

import { User } from 'firebase/auth';
import { useDbContent } from '../contexts/DBContentContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { signOutUser } from '../helpers/signoutUser';
import { SectionContent } from '../interfaces/sectionInterfaces';
import { SiteSettingsData } from '../interfaces/SettingsInterfaces';
import { readAndWriteToFirebase } from '../utils/firebaseFunctions';
import AllAdminsView from './AllAdminsView';
import SiteSettings from './SiteSettings';
import { SaveTextsButton } from './smallComponents/SaveTextsButton';

interface Props {
   user: User | null;
   pageID: string | null;
   sections: SectionContent[];
   handleDrop: (event: React.DragEvent<HTMLDivElement>, sections: SectionContent[]) => void;
}

const SectionNavigator: React.FC<Props> = ({ sections, handleDrop, user, pageID }) => {
   const [open, setOpen] = useState(false);
   const { websiteID } = useDbContent();
   const [siteSettingsOpen, setSiteSettingsOpen] = useState(false);
   const { siteSettings, setSiteSettings } = useSiteSettings();

   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
   const refBelowWebsiteID = pageID ? `customPages/${pageID}/content/` : `homepageContent/`;
   const saveSiteSettings = async (newSettings: SiteSettingsData) => {
      if (!newSettings) return;
      await readAndWriteToFirebase({
         method: 'update',
         ref: `websites/${websiteID}/settings/`,
         data: newSettings,
      });
      setSiteSettings(newSettings);
   };
   const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('section-order', `${(event.target as HTMLElement).dataset.order}`);
   };

   const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
   };

   const onHandleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      handleDrop(event, sections);
   };

   const toggleDrawer = () => setOpen(!open);
   const closeDrawer = () => setOpen(false); // Add this method for closing the drawer

   return (
      <>
         {isMobile && (
            <IconButton onClick={toggleDrawer} sx={{ position: 'absolute', top: 16, left: 16, zIndex: 999 }}>
               <MenuIcon />
            </IconButton>
         )}

         <Drawer
            variant={isMobile ? 'temporary' : 'permanent'}
            open={isMobile ? open : true}
            onClose={closeDrawer}
            ModalProps={{
               keepMounted: true, // Better open performance on mobile
            }}
            sx={{
               '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: isMobile ? '100%' : '240px',
                  p: 2,
                  ...(isMobile && {
                     height: '100vh',
                  }),
               },
            }}
         >
            {/* Close button inside the drawer */}
            {isMobile && (
               <IconButton onClick={closeDrawer} sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
                  <MUIButton>✖</MUIButton>
               </IconButton>
            )}

            <Box>
               <Button variant="outlined" color="error" onClick={signOutUser}>
                  Sign out
               </Button>
               <Typography variant="body1">{user ? user.email : 'N/A'}</Typography>
               <Typography variant="body2">{user ? user.displayName : 'N/A'}</Typography>
               <Typography variant="body2">{user ? user.phoneNumber : 'N/A'}</Typography>
               <Divider sx={{ my: 2 }} />
               <Typography variant="h6" gutterBottom>
                  Page Sections
               </Typography>
               <List>
                  {sections.length > 0 ? (
                     sections.map((section, index) => (
                        <Paper
                           key={section.sectionID + '-drawer-' + index}
                           draggable
                           onDragStart={handleDragStart}
                           onDragOver={handleDragOver}
                           onDrop={onHandleDrop}
                           data-id={section.sectionID}
                           data-order={section.sectionOrder}
                           sx={{
                              mb: 1.5,
                              px: 2,
                              py: 1,
                              cursor: 'grab',
                              backgroundColor: '#fefefe',
                              border: '1px solid #eee',
                           }}
                        >
                           <ListItem disablePadding>
                              <ListItemText primary={section.sectionName} />
                           </ListItem>
                        </Paper>
                     ))
                  ) : (
                     <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        No sections available. Start by adding content to the homepage.
                     </Typography>
                  )}
               </List>

               {sections.length > 0 && (
                  <Box textAlign="center" mt={4}>
                     <Typography variant="body2" gutterBottom>
                        Save current order:
                     </Typography>
                     <SaveTextsButton
                        buttonText="Save Order"
                        data={sections.reduce((acc, section) => ({ ...acc, [section.sectionID]: section }), {})}
                        refBelowWebsiteID={refBelowWebsiteID}
                     />
                  </Box>
               )}
            </Box>
            <Divider sx={{ my: 2 }} />
            <AllAdminsView />
            <Divider sx={{ my: 2 }} />
            <IconButton onClick={() => setSiteSettingsOpen(true)} color="primary">
               <SettingsIcon /> Settings
            </IconButton>
            <Box sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
               <Typography variant="caption">v1.0.0.1</Typography>
            </Box>
         </Drawer>
         <SiteSettings
            open={siteSettingsOpen}
            onClose={() => setSiteSettingsOpen(false)}
            siteSettings={siteSettings}
            onSave={(newSettings) => saveSiteSettings(newSettings)}
         />
      </>
   );
};

export default SectionNavigator;
