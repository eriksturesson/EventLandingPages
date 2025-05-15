import { Box, Grid, Paper, TextField } from '@mui/material';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DBSpeaker, DBSpeakersKey } from '../interfaces/dbInterfaces';
import { SectionProps, SectionTypes } from '../interfaces/sectionInterfaces';
import { EditorOfImage } from '../smallComponents/FileUploads';
import { SaveTextsButton, handleStateTextChange } from '../smallComponents/TextEdits';

export function SpeakersComponent(props: SectionProps): JSX.Element {
   const { data, adminEditor } = props;
   const { sectionName, sectionID } = data;
   const DBSpeakers = data.content as DBSpeakersKey | undefined;
   const nrOfSpeakers = (DBSpeakers && Object.keys(DBSpeakers).length) || 0;
   const newSpeaker = { id: uuidv4(), order: nrOfSpeakers + 1, image: '' };
   if (DBSpeakers && Object.keys(DBSpeakers).length > 0) {
      let arrayOfSpeakers: JSX.Element[] = [];
      Object.values(DBSpeakers)
         .sort((a, b) => a.order - b.order)
         .forEach((speaker, i) => {
            arrayOfSpeakers.push(
               <OneSpeaker
                  sectionID={sectionID}
                  sectionName={sectionName}
                  adminEditor={adminEditor}
                  speaker={speaker}
                  key={speaker.id}
               />
            );
         });

      return (
         <Grid container spacing={2}>
            {arrayOfSpeakers}
            {adminEditor ? (
               <>
                  <OneSpeaker
                     sectionID={sectionID}
                     sectionName={sectionName}
                     adminEditor={adminEditor}
                     speaker={newSpeaker}
                     key={newSpeaker.id}
                  />
               </>
            ) : null}
         </Grid>
      );
   } else {
      return (
         <>
            {adminEditor ? (
               <>
                  <OneSpeaker
                     sectionID={sectionID}
                     sectionName={sectionName}
                     adminEditor={adminEditor}
                     speaker={newSpeaker}
                     key={newSpeaker.id}
                  />
               </>
            ) : null}
         </>
      );
   }
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

   return (
      <Grid container sx={{ sm: 6, md: 6, lg: 4 }} spacing={2}>
         {adminEditor ? (
            <Paper elevation={5} sx={{ marginLeft: '2rem', marginBottom: '1rem' }}>
               <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f9f9f9', mb: 3 }}>
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
            <Box sx={{ p: 2, borderRadius: 2, mb: 3 }}>
               <h1 className="speaker-description">{title}</h1>
               <h2 className="speaker-description">{titleDescription}</h2>
               <img className="speaker-image" src={image} />
               <h2 className="speaker-description">{fullName}</h2>
               <h2 className="speaker-description">{description}</h2>
               <h2 className="speaker-description">{pitch}</h2>
            </Box>
         )}
      </Grid>
   );
}
