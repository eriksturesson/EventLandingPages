import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Grid, Paper, SvgIcon, TextField, Typography } from '@mui/material';
import { ref as dbRef, set } from 'firebase/database';
import { deleteObject, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDbContent } from '../../contexts/DBContentContext';
import { DBSpeaker, DBSpeakersKey } from '../../interfaces/dbInterfaces';
import { SectionProps, SectionTypes } from '../../interfaces/sectionInterfaces';
import { db, storage } from '../../utils/firebase';
import { EditorOfImage } from '../smallComponents/FileUploads';
import { SaveTextsButton, handleStateTextChange } from '../smallComponents/TextEdits';

export function SpeakersComponent(props: SectionProps): JSX.Element {
   const { data, adminEditor, pageID } = props;
   const { sectionName, sectionID } = data;
   const { websiteID } = useDbContent();
   const content = data.content as DBSpeakersKey | undefined;
   const [speakers, setSpeakers] = useState<DBSpeaker[]>([]);

   useEffect(() => {
      if (content) {
         const parsed = Object.entries(content).map(([id, speaker]) => ({
            ...speaker,
            id,
            fullName: speaker.fullName || '',
            description: speaker.description || '',
            pitch: speaker.pitch || '',
            title: speaker.title || '',
            titleDescription: speaker.titleDescription || '',
            image: speaker.image || '',
         }));
         setSpeakers(parsed);
      }
   }, [content]);

   const handleRemove = (id: string, imgStorageRef: string) => {
      const path = pageID
         ? `customPages/${pageID}/content/${sectionID}/content/${id}`
         : `homepageContent/${sectionID}/content/${id}`;

      const dbPath = dbRef(db, `websites/${websiteID}/${path}`);
      set(dbPath, null); // delete from database
      if (imgStorageRef) {
         const imgRef = ref(storage, imgStorageRef);
         deleteObject(imgRef).catch(console.error); // delete from storage
      }
      setSpeakers((prev) => prev.filter((speaker) => speaker.id !== id));
   };
   const newSpeaker: DBSpeaker = {
      id: uuidv4(),
      order: speakers.length + 1,
      fullName: '',
      description: '',
      pitch: '',
      title: '',
      titleDescription: '',
      image: '',
   };

   return (
      <>
         <Grid container spacing={2}>
            {speakers &&
               Object.values(speakers)
                  .sort((a, b) => a.order - b.order)
                  .map((speaker) => {
                     const count = speakers.length;
                     const lgSize = count === 1 ? 12 : count === 2 ? 6 : 4;
                     return (
                        <Grid item xs={12} md={6} lg={lgSize} key={speaker.id}>
                           <OneSpeaker
                              sectionID={sectionID}
                              sectionName={sectionName}
                              adminEditor={adminEditor}
                              speaker={speaker}
                              onRemove={handleRemove}
                              pageID={pageID}
                           />
                        </Grid>
                     );
                  })}

            {adminEditor && (
               <Grid item xs={12} md={6} lg={4} key={newSpeaker.id}>
                  <OneSpeaker
                     sectionID={sectionID}
                     sectionName={sectionName}
                     adminEditor={adminEditor}
                     speaker={newSpeaker}
                     pageID={pageID}
                     onRemove={handleRemove}
                  />
               </Grid>
            )}
         </Grid>
      </>
   );
}
export function OneSpeaker({
   adminEditor,
   speaker,
   sectionID,
   sectionName,
   onRemove,
   pageID,
}: {
   sectionID: string;
   sectionName: SectionTypes;
   adminEditor: boolean;
   pageID: string | null;
   onRemove: (id: string, imgStorageRef: string) => void;
   speaker: DBSpeaker;
}): JSX.Element {
   const { image, id, order } = speaker;
   const [title, setTitle] = useState(speaker.title || '');
   const [titleDescription, setTitleDescription] = useState(speaker.titleDescription || '');
   const [fullName, setFullName] = useState(speaker.fullName || '');
   const [description, setDescription] = useState(speaker.description || '');
   const [pitch, setPitch] = useState(speaker.pitch || '');

   return adminEditor ? (
      <Paper elevation={5} sx={{ p: 2, borderRadius: 2, bgcolor: '#f9f9f9', mb: 3 }}>
         <Box
            sx={{
               marginTop: '1rem',
               backgroundColor: 'grey',
               textAlign: 'center',
               width: '100%',
               display: 'flex',
               alignItems: 'center',
            }}
         >
            <SvgIcon
               style={{ color: 'red', cursor: 'pointer' }}
               onClick={() => onRemove(id, image as string)}
               component={DeleteIcon}
               fontSize="large"
            />
         </Box>
         <Box sx={{ p: 2, borderRadius: 2, mb: 3 }}>
            <TextField
               fullWidth
               sx={{ mt: '1rem' }}
               label="Title"
               variant="outlined"
               value={title}
               onChange={(e) => handleStateTextChange(setTitle, e)}
            />

            <TextField
               fullWidth
               sx={{ mt: '1rem' }}
               label="Title description"
               variant="outlined"
               value={titleDescription}
               onChange={(e) => handleStateTextChange(setTitleDescription, e)}
            />
            <Box
               sx={{
                  maxWidth: '300',
                  width: '100%',
                  height: '300',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  borderRadius: 2,
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

            <TextField
               fullWidth
               sx={{ mt: '1rem' }}
               label="Full name"
               variant="outlined"
               value={fullName}
               onChange={(e) => handleStateTextChange(setFullName, e)}
            />

            <TextField
               fullWidth
               sx={{ mt: '1rem' }}
               label="Description"
               variant="outlined"
               value={description}
               onChange={(e) => handleStateTextChange(setDescription, e)}
            />

            <TextField
               fullWidth
               sx={{ mt: '1rem' }}
               label="Pitch"
               variant="outlined"
               value={pitch}
               onChange={(e) => handleStateTextChange(setPitch, e)}
            />
            <SaveTextsButton
               refBelowWebsiteID={
                  pageID
                     ? `customPages/${pageID}/content/${sectionID}/content/${id}/`
                     : `homepageContent/${sectionID}/content/${id}/`
               }
               data={{
                  id: id,
                  order: order,
                  pitch: pitch,
                  description: description,
                  fullName: fullName,
                  title: title,
                  titleDescription: titleDescription,
               }}
            />
         </Box>
      </Paper>
   ) : (
      <Box
         sx={{
            p: 2,
            borderRadius: 2,
            mb: 3,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
         }}
      >
         <Typography variant="h4" gutterBottom>
            {title}
         </Typography>
         <Typography variant="subtitle1" gutterBottom>
            {titleDescription}
         </Typography>

         <Box
            component="img"
            src={image}
            alt={fullName}
            sx={{
               width: '100%',
               maxWidth: '300px',
               borderRadius: '50%',
               objectFit: 'cover',
               mx: 'auto',
               display: 'block',
            }}
         />

         <Typography variant="h6" sx={{ mt: 2 }}>
            {fullName}
         </Typography>
         <Typography variant="body1" sx={{ mt: 1 }}>
            {description}
         </Typography>
         <Typography variant="body2" sx={{ mt: 1 }}>
            {pitch}
         </Typography>
      </Box>
   );
}
