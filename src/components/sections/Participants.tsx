import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Divider, SvgIcon } from '@mui/material';
import { ref as dbRef, set } from 'firebase/database';
import { deleteObject, ref } from 'firebase/storage';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import addNewSpeakerExample from '../../assets/addNewSpeakerExample.png';
import { useDbContent } from '../../contexts/DBContentContext';
import { DBOneParticipant, DBParticipantKey } from '../../interfaces/dbInterfaces';
import { SectionProps, SectionTypes } from '../../interfaces/sectionInterfaces';
import { db, storage } from '../../utils/firebase';
import { EditorOfImage } from '../smallComponents/FileUploads';
import { EditText, SaveTextsButton, handleStateTextChange } from '../smallComponents/TextEdits';

export function OneParticipant({
   newCard,
   adminEditor,
   oneParticipant,
   sectionID,
   sectionName,
   pageID,
}: {
   newCard?: true;
   adminEditor: boolean;
   oneParticipant: DBOneParticipant;
   sectionID: string;
   sectionName: SectionTypes;
   pageID: string | null;
}): JSX.Element {
   const { websiteID } = useDbContent();
   const { id, order, image } = oneParticipant;
   const [name, setName] = useState(oneParticipant.name);
   const [title, setTitle] = useState(oneParticipant.title);
   const [organization, setOrganization] = useState(oneParticipant.organization);

   const removeParticipantCard = (id: string, imgStorageRef: string) => {
      return () => {
         //Remove from db
         const refAfterWebsiteID = pageID
            ? `customPages/${pageID}/content/${sectionID}/content/${id}`
            : `homepageContent/${sectionID}/content/${id}`;
         const participantCardsRef = dbRef(db, `websites/${websiteID}/` + refAfterWebsiteID);
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
               <EditorOfImage
                  sectionID={sectionID}
                  order={order}
                  sectionName={sectionName}
                  id={id}
                  image={undefined}
                  pageID={pageID}
               />
            ) : null}
            {!newCard ? <img className="participant-image" src={image} /> : null}
            {adminEditor ? (
               <>
                  <EditText
                     type={'header'}
                     onChange={(event: any) => handleStateTextChange(setName, event)}
                     value={name ? name : ''}
                     labelName={'Name'}
                  />
                  <EditText
                     type={'description'}
                     labelName={'Title'}
                     onChange={(event: any) => handleStateTextChange(setTitle, event)}
                     value={title ? title : ''}
                  />
                  <EditText
                     type={'description'}
                     labelName={'Organization'}
                     onChange={(event: any) => handleStateTextChange(setOrganization, event)}
                     value={organization ? organization : ''}
                  />
                  <SaveTextsButton
                     refBelowWebsiteID={
                        pageID
                           ? `customPages/${pageID}/content/${sectionID}/content/${id}`
                           : `homepageContent/${sectionID}/content/${id}`
                     }
                     data={{ name: name, title: title, organization: organization, id: id, order: order }}
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
   const { data, adminEditor, pageID } = props;
   const { sectionName, sectionID, sectionOrder, createdAt, updatedAt } = data;
   const content = data.content as DBParticipantKey | undefined;
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
                  pageID={pageID}
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
                  pageID={pageID}
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
                     pageID={pageID}
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
                     pageID={pageID}
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
                     pageID={pageID}
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
