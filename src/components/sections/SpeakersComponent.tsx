import { Box, Grid, Paper, TextField } from '@mui/material';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DBSpeaker, DBSpeakersKey } from '../../interfaces/dbInterfaces';
import { SectionProps, SectionTypes } from '../../interfaces/sectionInterfaces';
import { EditorOfImage } from '../smallComponents/FileUploads';
import { SaveTextsButton, handleStateTextChange } from '../smallComponents/TextEdits';

export function SpeakersComponent(props: SectionProps): JSX.Element {
   const { data, adminEditor } = props;
   const { sectionName, sectionID } = data;
   const DBSpeakers = data.content as DBSpeakersKey | undefined;
   const nrOfSpeakers = (DBSpeakers && Object.keys(DBSpeakers).length) || 0;
   const newSpeaker = { id: uuidv4(), order: nrOfSpeakers + 1, image: '' };

   return (
      <Grid container spacing={2}>
         {DBSpeakers &&
            Object.values(DBSpeakers)
               .sort((a, b) => a.order - b.order)
               .map((speaker) => (
                  <Grid item xs={12} md={6} lg={4} key={speaker.id}>
                     <OneSpeaker
                        sectionID={sectionID}
                        sectionName={sectionName}
                        adminEditor={adminEditor}
                        speaker={speaker}
                     />
                  </Grid>
               ))}

         {adminEditor && (
            <Grid item xs={12} md={6} lg={4} key={newSpeaker.id}>
               <OneSpeaker sectionID={sectionID} sectionName={sectionName} adminEditor={adminEditor} speaker={newSpeaker} />
            </Grid>
         )}
      </Grid>
   );
}
export function OneSpeaker({
   adminEditor,
   speaker,
   sectionID,
   sectionName,
}: {
   sectionID: string;
   sectionName: SectionTypes;
   adminEditor: boolean;

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

            <EditorOfImage sectionID={sectionID} order={order} sectionName={sectionName} image={image} id={id} />

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
               refBelowWebsiteID={`homepageContent/${sectionID}/content/${id}/`}
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
         <h1 className="speaker-description">{title}</h1>
         <h2 className="speaker-description">{titleDescription}</h2>
         <Box
            component="img"
            src={image}
            alt={fullName}
            sx={{
               maxWidth: '100%',
               width: '400px',
               height: '400px',
               borderRadius: '50%',
               objectFit: 'cover',
               mx: 'auto',
               display: 'block',
            }}
         />
         <h2 className="speaker-description">{fullName}</h2>
         <h2 className="speaker-description">{description}</h2>
         <h2 className="speaker-description">{pitch}</h2>
      </Box>
   );
}
