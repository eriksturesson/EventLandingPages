import { Box, Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
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
   pageID: string | null;
   sectionID: string;
   sectionName: SectionTypes;
}
export function OnePitchCard(props: OnePitchCardProps): JSX.Element {
   const { adminEditor, sectionID, sectionName, pitchCard, pageID } = props;
   const { image, order, id } = pitchCard;
   const { websiteID } = useDbContent();
   const [title, setTitle] = useState(pitchCard.title || '');
   const [description, setDescription] = useState(pitchCard.description || '');
   const smallScreen = window.innerWidth < 600;
   const handleTitleChange = (event: any) => {
      let text: string = event.target.value;
      setTitle(text);
   };

   const handleDescriptionChange = (event: any) => {
      let text: string = event.target.value;
      setDescription(text);
   };

   const removePitchCard = (id: string, img: string | undefined) => {
      return () => {
         //Remove from db
         const path = pageID
            ? `websites/${websiteID}/customPages/${pageID}/content/${sectionID}/content/${id}`
            : `websites/${websiteID}/homepageContent/${sectionID}/content/${id}`;
         const pitchCardsRef = dbRef(db, path);
         set(pitchCardsRef, null);
         // Create a reference to the file to delete from Storage
         if (img) {
            const pitchCardImgRefInStorage = ref(storage, img);

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
         }
      };
   };

   if (adminEditor) {
      return (
         <Card
            sx={{
               p: 2,
               borderRadius: 2,
               bgcolor: '#fafafa',
               mb: 3,
               display: 'flex',
               flexDirection: 'column',
               height: '100%',
            }}
         >
            <Box
               sx={{
                  borderRadius: 1,
                  overflow: image ? 'hidden' : undefined,
                  objectFit: 'cover',
                  objectPosition: 'top',
                  height: image ? '500px' : undefined,
                  maxHeight: smallScreen ? '300px' : '400px',
               }}
            >
               <EditorOfImage
                  sectionID={sectionID}
                  order={order}
                  sectionName={sectionName}
                  image={image}
                  id={id}
                  pageID={pageID}
               />
            </Box>
            <Box sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
               <EditText style={{ paddingTop: '2rem' }} onChange={handleTitleChange} value={title} />
               <EditText
                  style={{ paddingTop: '2rem' }}
                  labelName="Pitch"
                  onChange={handleDescriptionChange}
                  rows={10}
                  value={description}
               />
            </Box>
            <Box>
               <SaveTextsButton
                  refBelowWebsiteID={
                     pageID
                        ? `customPages/${pageID}/content/${sectionID}/content/${id}`
                        : `homepageContent/${sectionID}/content/${id}`
                  }
                  data={{ title, description, id, order }}
               />
               <Button variant="outlined" color="error" onClick={removePitchCard(id, image)} disabled={!image}>
                  Ta bort
               </Button>
            </Box>
         </Card>
      );
   }

   // Icke-admin vy: Visa snygg Card istället för egen Box + img
   return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
         <CardMedia
            component="img"
            image={image}
            alt={title}
            sx={{ height: 300, objectFit: 'cover', objectPosition: 'top' }}
         />
         <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h1" gutterBottom>
               {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
               {description}
            </Typography>
         </CardContent>
      </Card>
   );
}

export function PitchCardsComponent(props: SectionProps): JSX.Element {
   const { data, adminEditor, pageID } = props;
   const { sectionName, sectionID, sectionOrder, createdAt, updatedAt } = data;
   const content = data.content as DBPitchCardKey | undefined;
   const pitchCardsDB = content;
   const newPitchCard: DBHomePageContentPitchCards = {
      order: 1,
      image: '', // url to storage
      id: uuidv4(),
   };
   return (
      <Grid container sx={{ p: 2, pb: 4 }} spacing={2}>
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
                        pageID={pageID}
                        key={i}
                     />
                  </Grid>
               ))}

         {adminEditor && (
            <Grid item xs={12} md={6} lg={4} key={newPitchCard.id}>
               <OnePitchCard
                  sectionID={sectionID}
                  sectionName={sectionName}
                  pageID={pageID}
                  adminEditor={adminEditor}
                  pitchCard={newPitchCard}
               />
            </Grid>
         )}
      </Grid>
   );
}
