import { Box, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import React from 'react';
import { SectionContent, SectionIDs } from './interfaces/sectionInterfaces';
import { SaveTextsButton } from './smallComponents/TextEdits';

interface Props {
   sections: SectionContent[];
   handleDrop: (event: React.DragEvent<HTMLDivElement>, sections: SectionContent[]) => void;
}

const refBelowWebsiteID = `homepageContent/`;

const SectionNavigator = ({ sections, handleDrop }: Props) => {
   const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('section-order', `${(event.target as HTMLElement).dataset.order}`);
   };

   const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
   };

   const onHandleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      handleDrop(event, sections);
   };

   return (
      <Box
         sx={{
            width: 280,
            borderRight: '1px solid #ddd',
            height: '100vh',
            boxSizing: 'border-box',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
         }}
      >
         <Box>
            <Typography variant="h6" gutterBottom>
               Page Sections
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
               Drag and drop to reorder the homepage sections.
            </Typography>

            <List>
               {sections.length > 0 ? (
                  sections.map((section, index) => (
                     <Paper
                        key={section.sectionID}
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
                           borderRadius: 2,
                           boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                           '&:hover': {
                              backgroundColor: '#f5f5f5',
                           },
                        }}
                     >
                        <ListItem disablePadding>
                           <ListItemText primary={section.sectionName} />
                        </ListItem>
                     </Paper>
                  ))
               ) : (
                  <Typography variant="body2" sx={{ p: 1, fontStyle: 'italic' }}>
                     No sections available. Start by adding content to the homepage.
                  </Typography>
               )}
            </List>

            {sections.length > 0 && (
               <Box mt={4}>
                  <Typography variant="subtitle2" gutterBottom>
                     Save current order:
                  </Typography>
                  <SaveTextsButton
                     refBelowWebsiteID={refBelowWebsiteID}
                     data={(() => {
                        const pageContent: SectionIDs = {};
                        sections.forEach((item) => {
                           pageContent[item.sectionID] = item;
                        });
                        return pageContent;
                     })()}
                  />
               </Box>
            )}
         </Box>

         <Box sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="caption">v0.0.0.1</Typography>
         </Box>
      </Box>
   );
};

export default SectionNavigator;
