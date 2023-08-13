import { deleteObject, ref, uploadBytes } from 'firebase/storage';
import { DBHomePageContentPitchCards, DBOneParticipant, DBParticipantKey } from '../interfaces/dbInterfaces';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import addNewSpeakerExample from '../../assets/addNewSpeakerExample.png';
import { child, push, update, ref as dbRef, set } from 'firebase/database';
import { db, devSettings, storage } from '../utils/firebase';
import { v4 as uuidv4 } from 'uuid';
import { WEBSITE_ID } from '../../App';
import { useState } from 'react';
import { Box, Button, Divider, Grid, SvgIcon, TextField } from '@mui/material';
import { ImageButtonFileUpload, NewImgBoxFileUpload } from '../smallComponents/FileUploads';
import { EditText, SaveTextsButton, handleStateTextChange } from '../smallComponents/TextEdits';
import { SectionProps, SectionTypes } from '../interfaces/sectionInterfaces';
import { PaidTwoTone } from '@mui/icons-material';

export function OneParticipant({
   newCard,
   adminEditor,
   oneParticipant,
   sectionID,
   sectionName,
}: {
   newCard?: true;
   adminEditor: boolean;
   oneParticipant: DBOneParticipant;
   sectionID: string;
   sectionName: SectionTypes;
}): JSX.Element {
   const { id, order, image } = oneParticipant;
   const [name, setName] = useState(oneParticipant.name);
   const [title, setTitle] = useState(oneParticipant.title);
   const [organization, setOrganization] = useState(oneParticipant.organization);

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
               <NewImgBoxFileUpload sectionID={sectionID} cardOrderNr={order} sectionName={sectionName} />
            ) : null}
            {!newCard ? <img className="participant-image" src={image} /> : null}
            {adminEditor ? (
               <>
                  <EditText
                     type={'header'}
                     onChange={(event: any) => handleStateTextChange(setName, event)}
                     initText={'name'}
                     labelName={'Name'}
                  />
                  <EditText
                     type={'description'}
                     labelName={'Title'}
                     onChange={(event: any) => handleStateTextChange(setTitle, event)}
                     initText={title}
                  />
                  <EditText
                     type={'description'}
                     labelName={'Organization'}
                     onChange={(event: any) => handleStateTextChange(setOrganization, event)}
                     initText={organization}
                  />
                  <SaveTextsButton
                     refBelowWebsiteID={`homepageContent/${sectionID}/content/${id}`}
                     data={{ name: name, title: title, organisation: organization, id: id, order: order }}
                  />
               </>
            ) : (
               <>
                  <h2>{name}</h2>
                  <h3>
                     {oneParticipant.title} @ {oneParticipant.organization}
                  </h3>
               </>
            )}
         </Box>
      </>
   );
}

export function ParticipantComponent(props: SectionProps): JSX.Element {
   const { data, adminEditor } = props;
   const { sectionName, sectionID, sectionOrder, createdAt, updatedAt } = data;
   const content = data.content as DBParticipantKey;
   const participants = content;

   if (participants && Object.keys(participants).length > 0) {
      let allParticipants: JSX.Element[] = [];
      for (let participant of Object.keys(participants)) {
         let participantObject = participants[participant];
         if (participantObject !== participants.title) {
            allParticipants.push(
               <OneParticipant
                  adminEditor={adminEditor}
                  sectionID={sectionID}
                  sectionName={sectionName}
                  oneParticipant={participantObject as DBOneParticipant}
                  key={Math.random()} /*temporary fix*/
               />
            );
         }
      }

      return (
         <div className="wrapper-participants">
            {adminEditor ? (
               <Divider>
                  <h2>Edit participants</h2>
               </Divider>
            ) : null}
            {allParticipants}
            {adminEditor ? (
               <OneParticipant
                  adminEditor={adminEditor}
                  sectionID={sectionID}
                  sectionName={sectionName}
                  newCard={true}
                  oneParticipant={
                     {
                        order: participants ? Object.keys(participants).length + 1 : 0,
                        image: addNewSpeakerExample,
                        name: '',
                        id: uuidv4(),
                        title: '',
                        organization: '',
                     } as DBOneParticipant
                  }
               />
            ) : null}
         </div>
      );
   } else {
      return (
         <div className="wrapper-participants">
            {adminEditor ? (
               <>
                  <OneParticipant
                     adminEditor={adminEditor}
                     newCard={true}
                     sectionName={sectionName}
                     sectionID={sectionID}
                     oneParticipant={
                        {
                           order: participants ? Object.keys(participants).length + 1 : 0,
                           image: addNewSpeakerExample,
                           name: '',
                           id: uuidv4(),
                           title: '',
                           organization: '',
                        } as DBOneParticipant
                     }
                  />
                  <OneParticipant
                     adminEditor={adminEditor}
                     newCard={true}
                     sectionName={sectionName}
                     sectionID={sectionID}
                     oneParticipant={
                        {
                           order: participants ? Object.keys(participants).length + 1 : 0,
                           image: addNewSpeakerExample,
                           name: '',
                           id: uuidv4(),
                           title: '',
                           organization: '',
                        } as DBOneParticipant
                     }
                  />
                  <OneParticipant
                     adminEditor={adminEditor}
                     newCard={true}
                     sectionName={sectionName}
                     sectionID={sectionID}
                     oneParticipant={
                        {
                           order: participants ? Object.keys(participants).length + 1 : 0,
                           image: addNewSpeakerExample,
                           name: '',
                           id: uuidv4(),
                           title: '',
                           organization: '',
                        } as DBOneParticipant
                     }
                  />
               </>
            ) : null}
         </div>
      );
   }
}
