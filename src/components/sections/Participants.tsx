import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Divider, SvgIcon } from '@mui/material';
import { ref as dbRef, set } from 'firebase/database';
import { deleteObject, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import addNewSpeakerExample from '../../assets/addNewSpeakerExample.png';
import { useDbContent } from '../../contexts/DBContentContext';
import { DBOneParticipant, DBParticipantKey } from '../../interfaces/dbInterfaces';
import { SectionProps, SectionTypes } from '../../interfaces/sectionInterfaces';
import { db, storage } from '../../utils/firebase';
import { EditorOfImage } from '../smallComponents/FileUploads';
import { EditText, SaveTextsButton, handleStateTextChange } from '../smallComponents/TextEdits';

export function OneParticipant({
   adminEditor,
   oneParticipant,
   sectionID,
   sectionName,
   onRemove,
   pageID,
}: {
   adminEditor: boolean;
   oneParticipant: DBOneParticipant;
   onRemove: (id: string, imgStorageRef: string) => void;
   sectionID: string;
   sectionName: SectionTypes;
   pageID: string | null;
}): JSX.Element {
   const { id, order, image } = oneParticipant;
   const [name, setName] = useState(oneParticipant.name);
   const [title, setTitle] = useState(oneParticipant.title);
   const [organization, setOrganization] = useState(oneParticipant.organization);

   return (
      <Box className="participant-box" id={oneParticipant.id}>
         {adminEditor ? (
            <>
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
                     onClick={() => onRemove(oneParticipant.id, oneParticipant.image as string)}
                     component={DeleteIcon}
                     fontSize="large"
                  />
               </Box>

               <EditorOfImage
                  sectionID={sectionID}
                  order={order}
                  sectionName={sectionName}
                  id={id}
                  image={image}
                  pageID={pageID}
               />
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
               <img className="participant-image" src={image} />
               <h2>{name}</h2>
               <h3>
                  {oneParticipant.title} @ {oneParticipant.organization}
               </h3>
            </>
         )}
      </Box>
   );
}

export function ParticipantComponent(props: SectionProps): JSX.Element {
   const { data, adminEditor, pageID } = props;
   const { sectionName, sectionID, sectionOrder, createdAt, updatedAt } = data;
   const { websiteID } = useDbContent();

   const [participants, setParticipants] = useState<DBOneParticipant[]>([]);
   const nrOfParticipants = participants.length;
   const newParticipant = { id: uuidv4(), order: nrOfParticipants + 1, image: '' };

   useEffect(() => {
      if (data.content) {
         const entries = Object.entries(data.content as DBParticipantKey);
         const parsed = entries.map(([id, p]) => ({
            ...p,
            id,
            image: p.image || addNewSpeakerExample,
            name: p.name || '',
            title: p.title || '',
            organization: p.organization || '',
         }));
         setParticipants(parsed);
      }
   }, [data.content]);
   const handleRemove = (id: string, imgStorageRef: string) => {
      const refAfterWebsiteID = pageID
         ? `customPages/${pageID}/content/${sectionID}/content/${id}`
         : `homepageContent/${sectionID}/content/${id}`;
      const participantCardsRef = dbRef(db, `websites/${websiteID}/${refAfterWebsiteID}`);

      set(participantCardsRef, null);
      if (imgStorageRef) {
         const participantImgRefInStorage = ref(storage, imgStorageRef);
         deleteObject(participantImgRefInStorage).catch(console.error);
      }
      setParticipants((prev) => prev.filter((p) => p.id !== id));
   };
   return (
      <div className="wrapper-participants">
         {adminEditor ? (
            <Divider>
               <h2>Edit participants</h2>
            </Divider>
         ) : null}

         {participants &&
            Object.values(participants)
               .sort((a, b) => a.order - b.order)
               .map((participant) => (
                  <OneParticipant
                     key={'oneparticipant' + participant.id}
                     adminEditor={adminEditor}
                     onRemove={handleRemove}
                     sectionID={sectionID}
                     pageID={pageID}
                     sectionName={sectionName}
                     oneParticipant={
                        {
                           order: participant.order,
                           image: participant.image || addNewSpeakerExample,
                           name: participant.name || '',
                           id: participant.id,
                           title: participant.title || '',
                           organization: participant.organization || '',
                        } as DBOneParticipant
                     }
                  />
               ))}

         {adminEditor && (
            <OneParticipant
               adminEditor={adminEditor}
               sectionID={sectionID}
               onRemove={handleRemove}
               pageID={pageID}
               sectionName={sectionName}
               oneParticipant={
                  {
                     order: newParticipant.order,
                     image: newParticipant.image || addNewSpeakerExample,
                     name: '',
                     id: newParticipant.id,
                     title: '',
                     organization: '',
                  } as DBOneParticipant
               }
            />
         )}
      </div>
   );
}
