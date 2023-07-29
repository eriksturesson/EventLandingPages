import { deleteObject, ref, uploadBytes } from 'firebase/storage';
import { DBHomePageContentPitchCards, DBOneParticipant, DBParticipantKey } from '../interfaces/dbInterfaces';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import { child, push, update, ref as dbRef, set } from 'firebase/database';
import { db, devSettings, storage } from '../utils/firebase';
import { WEBSITE_ID } from '../../App';
import { useState } from 'react';
import { Box, Button, Divider, SvgIcon, TextField } from '@mui/material';
import { ImageCardFileUpload } from '../smallComponents/FileUploads';
import { EditText, SaveTextsButton } from '../smallComponents/TextEdits';

export function OneParticipant({
   newCard,
   adminEditor,
   oneParticipant,
   sectionID,
}: {
   newCard?: true;
   adminEditor: boolean;
   oneParticipant: DBOneParticipant;
   sectionID: string;
}): JSX.Element {
   const { id, order, image } = oneParticipant;
   const [name, setName] = useState(oneParticipant.name);
   const [title, setTitle] = useState(oneParticipant.title);
   const [organisation, setOrganisation] = useState(oneParticipant.organization);

   const handleNameChange = (event: any) => {
      let text: string = event.target.value;
      setName(text);
   };

   const handleTitleChange = (event: any) => {
      let text: string = event.target.value;
      setTitle(text);
   };

   const handleOrganisationChange = (event: any) => {
      let text: string = event.target.value;
      setOrganisation(text);
   };

   const handleSaveTexts = () => {
      // Perform your save logic here, e.g., make an API call to save the data
      console.log('Saving texts to db');
      console.log('name: ' + name);
      console.log('title: ' + title);
      console.log('organisation: ' + organisation);
      update(dbRef(db, `websites/${WEBSITE_ID}/homepageContent/${sectionID}/content/${id}`), {
         name: name,
         title: title,
         organisation: organisation,
         id: id,
         order: order,
      });

      console.log('Saved title and description');
   };

   const removeParticipantCard = (id: string, imgStorageRef: string) => {
      return () => {
         //Remove from db
         const participantCardsRef = dbRef(db, `websites/${WEBSITE_ID}/homepageContent/${sectionID}/content/${id}`);
         set(participantCardsRef, null);
         // Create a reference to the file to delete from Storage
         const participantImgRefInStorage = ref(storage, imgStorageRef);

         // Delete the file
         deleteObject(participantImgRefInStorage)
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
   return (
      <>
         <Box className="participant-box" id={oneParticipant.id}>
            {adminEditor && id && !newCard ? (
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
                     onClick={removeParticipantCard(id, image as string)}
                     component={DeleteIcon}
                     fontSize="large"
                  />
               </Box>
            ) : null}
            {adminEditor && newCard ? (
               <ImageCardFileUpload cardOrderNr={order} sectionName={'participants'} sectionID={sectionID} />
            ) : null}
            <img className="participant-image" src={oneParticipant.image} />
            {adminEditor ? (
               <EditText onChange={handleTitleChange} initText={name ? name : 'Test Testersson'} />
            ) : (
               <h2>{name}</h2>
            )}
            {adminEditor ? (
               <>
                  <EditText onChange={handleTitleChange} initText={title ? title : 'Tester'} />
                  <EditText onChange={handleOrganisationChange} initText={organisation ? organisation : 'Testers AB'} />
               </>
            ) : (
               <h3>
                  {oneParticipant.title} @ {oneParticipant.organization}
               </h3>
            )}
            {adminEditor ? <SaveTextsButton onSave={handleSaveTexts} /> : null}
         </Box>
      </>
   );
}

interface ParticipantComponentProps {
   adminEditor: boolean;
   participants: DBParticipantKey;
   sectionID: string;
}
export function ParticipantComponent({ props }: { props: ParticipantComponentProps }): JSX.Element {
   const { participants, adminEditor, sectionID } = props;
   let newAdminImg = '';
   {
      adminEditor
         ? (newAdminImg = `<div style={{width: "400px", height: "400px", backgroundColor: "grey"}}> ${ImageIcon}</div>`)
         : null;
   }
   if (participants && Object.keys(participants).length > 0) {
      let allParticipants: JSX.Element[] = [];
      for (let participant of Object.keys(participants)) {
         let participantObject = participants[participant];
         if (participantObject !== participants.title) {
            allParticipants.push(
               <OneParticipant
                  adminEditor={adminEditor}
                  sectionID={sectionID}
                  oneParticipant={participantObject as DBOneParticipant}
               />
            );
         }
      }

      return (
         <>
            <h1>{participants?.title}</h1>
            {adminEditor ? (
               <Divider>
                  <h2>Edit participants</h2>
               </Divider>
            ) : null}
            <div className="wrapper-participants">
               {allParticipants}
               {adminEditor ? (
                  <OneParticipant
                     adminEditor={adminEditor}
                     sectionID={sectionID}
                     newCard={true}
                     oneParticipant={
                        {
                           order: participants ? Object.keys(participants).length + 1 : 1,
                           image: newAdminImg,
                           name: 'Test Testersson',
                           id: 'randomKey',
                           title: 'Tester',
                           organization: 'Testers AB',
                        } as DBOneParticipant
                     }
                  />
               ) : null}
            </div>
         </>
      );
   } else {
      return (
         <>
            {adminEditor ? (
               <OneParticipant
                  adminEditor={adminEditor}
                  newCard={true}
                  sectionID={sectionID}
                  oneParticipant={
                     {
                        order: participants ? Object.keys(participants).length + 1 : 1,
                        image: newAdminImg,
                        name: 'Test Testersson',
                        id: 'randomKey',
                        title: 'Tester',
                        organization: 'Testers AB',
                     } as DBOneParticipant
                  }
               />
            ) : null}
         </>
      );
   }
}
