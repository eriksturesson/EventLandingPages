import { Box, useMediaQuery, useTheme } from '@mui/material';
import { User } from 'firebase/auth';
import React from 'react';
import { SectionContent } from './interfaces/sectionInterfaces';
import { SectionLoader } from './SectionLoader';
import SectionNavigator from './SectionNavigator';

interface AdminProps {
   user: User | null;
   homepageContent: SectionContent[];
   setHomepageContent: React.Dispatch<React.SetStateAction<SectionContent[]>>;
}

const Admin: React.FC<AdminProps> = ({ user, homepageContent, setHomepageContent }) => {
   const theme = useTheme();
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

      setHomepageContent(reordered);
   };

   const orderedSections = Object.values(homepageContent).sort((a, b) => a.sectionOrder - b.sectionOrder);
   return (
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
            <SectionNavigator sections={orderedSections} handleDrop={handleDrop} user={user} />
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
            <Box className="adminEdit" sx={{ transform: 'scale(1)', transformOrigin: '0% 0% 0px' }}>
               {homepageContent.length > 0 ? <SectionLoader data={homepageContent} adminEditor={true} /> : null}
            </Box>
         </Box>
      </Box>
   );
};

export default Admin;
