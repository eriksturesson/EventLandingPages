import React, { useState } from 'react';
import { Paper, Grid } from '@mui/material';
import { SectionContent } from './interfaces/sectionInterfaces';

type Props = {
   sections: SectionContent[];
};

function SectionNavigator(props: Props): JSX.Element {
   const [isDraggning, setDragging] = useState(false);
   const [sections, setSections] = useState(props.sections);

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
   };
   const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
      // console.log('leavning target');
   };
   const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      // console.log('dragging over target');
   };
   const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
      const droppedIndex = +event.dataTransfer.getData('section-order');
      let targetIndex = +((event.target as HTMLElement).dataset.order as string);

      if (droppedIndex === targetIndex) return console.log('nope not here');

      // const droppedIndex = sections.findIndex((section) => section.sectionID === droppedId);
      // targetIndex
      // const newSections = [...sections];
      let newSections = JSON.parse(JSON.stringify(sections)) as SectionContent[];

      const droppedItem = newSections.splice(droppedIndex, 1);
      console.log('dropped item', droppedItem);
      console.log('array, removed dropped item', newSections);

      console.log('slice 1', newSections.slice(0, targetIndex));
      console.log(
         'slice 2',
         newSections.slice(targetIndex === newSections.length ? targetIndex - 1 : targetIndex, newSections.length)
      );

      console.log('targetIndex', targetIndex);
      console.log('newSections.length', newSections.length);

      if (targetIndex === newSections.length || droppedIndex < targetIndex) targetIndex = targetIndex - 1;

      // targetIndex = targetIndex === newSections.length ? targetIndex - 1 : targetIndex;
      // targetIndex = droppedIndex < targetIndex ? targetIndex - 1 : targetIndex;

      let newNewSections = [
         ...newSections.slice(0, targetIndex),
         ...droppedItem,
         ...newSections.slice(targetIndex, newSections.length),
      ];

      console.log("after slice n' splice", newNewSections);

      newNewSections = newNewSections.map((item, i) => {
         item.sectionOrder = i;
         return item;
      });

      // newSections.map((a) => JSON.parse(JSON.stringify(a)));

      // if (droppedIndex > targetIndex) {
      //    newSections[targetIndex].sectionOrder = targetIndex;
      //    newSections[droppedIndex].sectionOrder = targetIndex - 1;
      //    newSections.map(() => 'a');

      //    console.log(newSections);
      // }

      // if (droppedIndex < targetIndex) {
      //    newSections[targetIndex].sectionOrder = targetIndex;
      //    newSections[droppedIndex].sectionOrder = targetIndex - 1;
      // }

      // newSections.sort((a, b) => a.sectionOrder - b.sectionOrder);

      console.log('after map', newNewSections);

      setSections(newNewSections);

      console.log('dropping', droppedIndex, 'on', targetIndex);
   };

   return (
      <Grid item xs={3} sx={{ display: 'flex', flexDirection: 'column', gap: '2em', padding: '2em', textAlign: 'center' }}>
         {sections.map((section, i) => (
            <Paper
               draggable
               onDragStart={handleDragStart}
               onDragEnd={handleDragEnd}
               onDragEnter={handleDragEnter}
               onDragLeave={handleDragLeave}
               onDragOver={handleDragOver}
               onDrop={handleDrop}
               key={i}
               data-id={section.sectionID}
               data-order={section.sectionOrder}
               sx={{ padding: '1em' }}
            >
               {section.sectionName}
            </Paper>
         ))}
      </Grid>
   );
}

export default SectionNavigator;
