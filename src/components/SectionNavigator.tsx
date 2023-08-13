import React, { useState } from 'react';
import { Paper, Grid, Box } from '@mui/material';
import { SectionContent, SectionIDs } from './interfaces/sectionInterfaces';
import { SaveTextsButton } from './smallComponents/TextEdits';
import { BorderRight } from '@mui/icons-material';

interface Props {
   sections: SectionContent[];
   handleDrop: (event: React.DragEvent<HTMLDivElement>, sections: SectionContent[]) => void;
}

const refBelowWebsiteID = `homepageContent/`;

function SectionNavigator(props: Props): JSX.Element {
   console.log('--------------------RENDERING SECTIONNAVIGATOR----------------------');
   // const [isDragHover, setDragHover] = useState({});
   // const [isDraggning, setDragging] = useState(false);
   // const [sections, setSections] = useState(props.sections);

   // const refBelowWebsiteID = `homepageContent/${sectionID}/content/`;

   // ts complains if not defined like this but I can't find another way

   const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('section-order', `${(event.target as HTMLElement).dataset.order}`);
      console.log('starting drag');
   };
   const handleDragEnd = () => {
      // console.log('ending drag');
   };
   const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
      // console.log(event);
      // console.log('entering target');
      // setDragHover({
      //    display: 'flex',
      //    flexDirection: 'column',
      //    justifyContent: 'flex-end',
      //    height: '6em',
      //    backgroundColor: 'red',
      // });
   };
   const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
      // console.log('leavning target');
      // setDragHover({});
   };
   const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      // console.log('dragging over target');
   };

   const onHandleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      props.handleDrop(event, props.sections);
   };

   return (
      <Grid
         item
         xs={3}
         sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2em',
            padding: '2em',
            textAlign: 'center',
            borderRight: '0.1rem solid grey',
         }}
      >
         {props.sections.map((section, i) => (
            <Box key={i}>
               <Paper
                  draggable
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={onHandleDrop}
                  data-id={section.sectionID}
                  data-order={section.sectionOrder}
                  sx={{ padding: '1em' }}
               >
                  {section.sectionName}
               </Paper>
            </Box>
         ))}
         <p>Save current state:</p>
         <p>⚠️Might also affect other unsaved changes!⚠️</p>

         <SaveTextsButton
            refBelowWebsiteID={refBelowWebsiteID}
            data={(() => {
               const pageContent: SectionIDs = {};
               props.sections.forEach((item) => {
                  pageContent[item.sectionID] = item;
               });
               return pageContent;
            })()}
         />
      </Grid>
   );
}

export default SectionNavigator;
