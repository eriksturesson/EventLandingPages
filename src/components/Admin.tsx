import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDbContent } from '../contexts/DBContentContext';
import { SectionContent } from '../interfaces/sectionInterfaces';
import { Login } from './Login';
import NavWrapper from './NavWrapper';
import { SectionLoader } from './SectionLoader';
import SectionNavigator from './SectionNavigator';

const Admin: React.FC = () => {
   const theme = useTheme();
   const { user } = useAuth();
   const { homepageContent, setHomepageContent, customPages, setCustomPages, customPageMetaData } = useDbContent();
   const [pageToEdit, setPageToEdit] = useState<string | null>(null);
   const currentPageContent = pageToEdit ? customPages[pageToEdit] ?? [] : homepageContent;
   const setCurrentPageContent = (content: SectionContent[]) => {
      if (pageToEdit) {
         setCustomPages((prev) => ({ ...prev, [pageToEdit]: content }));
      } else {
         setHomepageContent(content);
      }
   };
   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
   const handleDrop = async (event: React.DragEvent<HTMLDivElement>, sections: SectionContent[]) => {
      const droppedIndex = +event.dataTransfer.getData('section-order');
      const targetEl = (event.target as HTMLElement).closest('[data-order]');
      const targetIndexRaw = targetEl ? +targetEl.getAttribute('data-order')! : -1;

      if (droppedIndex === targetIndexRaw || targetIndexRaw === -1) return;

      let targetIndex = targetIndexRaw;
      const newSections = JSON.parse(JSON.stringify(sections)) as SectionContent[];

      const droppedItem = newSections.splice(droppedIndex, 1);

      if (targetIndex === newSections.length || droppedIndex < targetIndex) {
         targetIndex -= 1;
      }

      const reordered = [...newSections.slice(0, targetIndex), ...droppedItem, ...newSections.slice(targetIndex)].map(
         (item, index) => ({ ...item, sectionOrder: index })
      );

      setCurrentPageContent(reordered);
   };

   const orderedSections = [...currentPageContent].sort((a, b) => a.sectionOrder - b.sectionOrder);

   if (!user) return <Login />;
   const customPageAdminEdits = customPageMetaData.find((page) => page.pageID === pageToEdit);
   return (
      <>
         <NavWrapper isAdmin={true} setPageToEdit={setPageToEdit} />
         <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', height: '100vh' }}>
            {/* Section Navigator (Drawer) */}
            <Box
               sx={{
                  width: '240px', // Drawer width
                  height: '100vh',
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  overflowY: 'auto', // Allows scrolling for large content
                  padding: 2,
               }}
            >
               <SectionNavigator sections={orderedSections} handleDrop={handleDrop} user={user} pageID={pageToEdit} />
            </Box>

            {/* Main Content Area */}
            <Box
               sx={{
                  flexGrow: 1,
                  padding: 2,
                  marginTop: '20px', // Adjust based on your header height
                  marginLeft: isMobile ? 0 : '240px',
                  overflowY: 'auto',
               }}
            >
               <Typography variant="h4" sx={{ marginBottom: '20px' }}>
                  {pageToEdit ? `Editing Page: ${customPageAdminEdits?.pageName}` : 'Editing Homepage'}
               </Typography>
               <Box className="adminEdit" sx={{ transform: 'scale(1)', transformOrigin: '0% 0% 0px' }}>
                  <SectionLoader data={orderedSections} adminEditor={true} pageID={pageToEdit} />
               </Box>
            </Box>
         </Box>
      </>
   );
};

export default Admin;
