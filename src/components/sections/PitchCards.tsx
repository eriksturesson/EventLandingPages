import { Box, Grid, Paper } from '@mui/material';
import { ref as dbRef, set } from 'firebase/database';
import { deleteObject, ref } from 'firebase/storage';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useDbContent } from '../../contexts/DBContentContext';
import { DBHomePageContentPitchCards, DBPitchCardKey } from '../../interfaces/dbInterfaces';
import { SectionProps, SectionTypes } from '../../interfaces/sectionInterfaces';
import { db, storage } from '../../utils/firebase';
import { EditorOfImage } from '../smallComponents/FileUploads';
import { EditText, SaveTextsButton } from '../smallComponents/TextEdits';

interface OnePitchCardProps {
   adminEditor?: boolean;
   pitchCard: DBHomePageContentPitchCards;

   sectionID: string;
   sectionName: SectionTypes;
}
export function OnePitchCard(props: OnePitchCardProps): JSX.Element {
   const { adminEditor, sectionID, sectionName, pitchCard } = props;
   const { image, order, id } = pitchCard;
   const { websiteID } = useDbContent();
   const [title, setTitle] = useState(pitchCard.title || '');
   const [description, setDescription] = useState(pitchCard.description || '');

   const handleTitleChange = (event: any) => {
      let text: string = event.target.value;
      setTitle(text);
   };

   const handleDescriptionChange = (event: any) => {
      let text: string = event.target.value;
      setDescription(text);
   };

   const removePitchCard = (id: string, imgStorageRef: string) => {
      return () => {
         //Remove from db
         const pitchCardsRef = dbRef(db, `websites/${websiteID}/homepageContent/${sectionID}/content/${id}`);
         set(pitchCardsRef, null);
         // Create a reference to the file to delete from Storage
         const pitchCardImgRefInStorage = ref(storage, imgStorageRef);

         // Delete the file
         deleteObject(pitchCardImgRefInStorage)
            .then(() => {
               // File deleted successfully
               console.log('File deleted successfully');
            })
            .catch((error) => {
               // Uh-oh, an error occurred!
               console.log('Error deleting file');
            });
      };
   };

   return adminEditor ? (
      <Paper elevation={5} sx={{ p: 2, borderRadius: 2, bgcolor: '#f9f9f9', mb: 3 }}>
         <EditorOfImage sectionID={sectionID} order={order} sectionName={sectionName} image={image} id={id} />
         <EditText onChange={handleTitleChange} value={title ? title : ''} />
         <EditText onChange={handleDescriptionChange} value={description ? description : ''} />
         <SaveTextsButton
            refBelowWebsiteID={`homepageContent/${sectionID}/content/${id}`}
            data={{ title: title, description: description, id: id, order: order }}
         />
      </Paper>
   ) : (
      <Box className="pitchcard-container" id={id}>
         <Box className="pitchcard-box">
            {/*onClick={image ? removePitchCard(id, image) : undefined}*/}

            <img className="visningsbilder" alt="visningsbild1" src={image} />

            <h1>{title}</h1>

            <p>{description}</p>
         </Box>
      </Box>
   );
}

export function PitchCardsComponent(props: SectionProps): JSX.Element {
   const { data, adminEditor } = props;
   const { sectionName, sectionID, sectionOrder, createdAt, updatedAt } = data;
   const content = data.content as DBPitchCardKey | undefined;
   const pitchCardsDB = content;
   const newPitchCard: DBHomePageContentPitchCards = {
      order: 1,
      image: '', // url to storage
      id: uuidv4(),
   };
   return (
      <Grid container spacing={2}>
         {pitchCardsDB &&
            Object.values(pitchCardsDB)
               .sort((a, b) => a.order - b.order)
               .map((pitchCard, i) => (
                  <Grid item xs={12} md={6} lg={4} key={'grid-' + pitchCard.id}>
                     <OnePitchCard
                        sectionName={sectionName}
                        sectionID={sectionID}
                        adminEditor={adminEditor}
                        pitchCard={pitchCard}
                        key={i}
                     />
                  </Grid>
               ))}

         {adminEditor && (
            <Grid item xs={12} md={6} lg={4} key={newPitchCard.id}>
               <OnePitchCard
                  sectionID={sectionID}
                  sectionName={sectionName}
                  adminEditor={adminEditor}
                  pitchCard={newPitchCard}
               />
            </Grid>
         )}
      </Grid>
   );
}
