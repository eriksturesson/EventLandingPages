import { deleteObject, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { DBHomePageContentPitchCards, DBOneParticipant, DBParticipantKey } from '../interfaces/dbInterfaces';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import logoExample from '../../assets/logoExample.png';
import companyExample from '../../assets/companyExample.png';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import addNewSpeakerExample from '../../assets/addNewSpeakerExample.png';
import mapImageExample from '../../assets/mapImageExample.png';
import briefcaseExample from '../../assets/briefcaseExample.png';
import { child, push, update, ref as dbRef, set } from 'firebase/database';
import { db, devSettings, storage } from '../utils/firebase';
import { WEBSITE_ID } from '../../App';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Box, Button, Divider, SvgIcon, TextField } from '@mui/material';
import { SectionTypes } from '../interfaces/sectionInterfaces';
import { readAndWriteToFirebase } from '../utils/firebaseFunctions';

export interface ParticipantCardFileUploadProps {
   cardOrderNr: number;
   sectionID: string;
   sectionName: SectionTypes;
}

interface ImgCardFileUploadProps {
   sectionID: string;
   cardOrderNr: number;
   sectionName: SectionTypes;
   className?: string;
}

export function NewImgBoxFileUpload(props: ImgCardFileUploadProps): JSX.Element {
   const { sectionID, cardOrderNr, sectionName } = props;
   let backgroundImg = 'briefcase';
   let shape: 'circle' | 'square' = 'circle';
   let className = 'participant-image';
   switch (sectionName) {
      case 'fullScreenMedia':
         backgroundImg = logoExample;
         className = 'video-container';
         shape = 'square';
         break;
      case 'footer':
         backgroundImg = mapImageExample;
         className = 'kartbild';
         shape = 'square';
         break;
      case 'speakers':
         backgroundImg = addNewSpeakerExample;
         className = 'speaker-image';
         shape = 'circle';
         break;
      case 'participants':
         backgroundImg = addNewSpeakerExample;
         className = 'participant-image';
         shape = 'circle';
         break;
      case 'organizers':
         backgroundImg = companyExample;
         className = 'organizer-logo';
         shape = 'square';
         break;
      case 'pitchCards':
         backgroundImg = briefcaseExample;
         className = 'visningsbilder';
         shape = 'square';
         break;
      default:
         backgroundImg = briefcaseExample;
         className = 'participant-image';
         shape = 'square';
   }
   let backgroundColor = shape === 'square' ? 'grey' : undefined;
   return (
      <Box
         minHeight="10rem"
         sx={{
            textAlign: 'center',
            width: '100%',
            backgroundColor: backgroundColor,
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3,
            marginBottom: '2rem',
         }}
      >
         <Box
            sx={{
               textAlign: 'center',
               position: 'absolute',
               zIndex: 1,
            }}
         >
            <SvgIcon component={AddPhotoAlternateIcon} fontSize="large" />
            <br></br>
            <ImageButtonFileUpload sectionID={sectionID} sectionName={sectionName} cardOrderNr={cardOrderNr} />
         </Box>
         <img className={className} src={backgroundImg} />
      </Box>
   );
}

interface AdvancedFileUploadProps extends ParticipantCardFileUploadProps {
   event: React.ChangeEvent<HTMLInputElement>;
}

export function advancedFileUpload(props: AdvancedFileUploadProps): void {
   const { event, cardOrderNr, sectionName, sectionID } = props;
   const file = event?.target?.files ? event.target.files[0] : null;
   let randomKey = uuidv4();
   if (file) {
      const storageRef = ref(
         storage,
         `websites/${WEBSITE_ID}/homepageContent/${sectionID}/content/${randomKey}/items/${file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);
      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
         'state_changed',
         (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
               case 'paused':
                  console.log('Upload is paused');
                  break;
               case 'running':
                  console.log('Upload is running');
                  break;
            }
         },
         (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
               case 'storage/unauthorized':
                  // User doesn't have permission to access the object
                  break;
               case 'storage/canceled':
                  // User canceled the upload
                  break;

               // ...

               case 'storage/unknown':
                  // Unknown error occurred, inspect error.serverResponse
                  break;
            }
            console.error(error.code);
         },
         () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
               console.log('File available at', downloadURL);
               readAndWriteToFirebase({
                  method: 'update',
                  ref: `websites/${WEBSITE_ID}/homepageContent/${sectionID}/content/items/${randomKey}/`,
                  data: { image: downloadURL, cardOrderNr: cardOrderNr, id: randomKey },
               });
               return downloadURL;
            });
         }
      );
   }
}

function handleFileUpload(props: AdvancedFileUploadProps) {
   const { event, cardOrderNr, sectionName, sectionID } = props;
   if (event?.target?.files) {
      //setFile(event.target.files[0])
      let randomkey = push(child(dbRef(db), `websites/${WEBSITE_ID}/homepageContent/${sectionID}/content/`)).key;
      const pitchCardRef = ref(storage, `websites/${WEBSITE_ID}/homepageContent/${sectionID}/content/${randomkey}/image/`);
      // 'file' comes from the Blob or File API
      uploadBytes(pitchCardRef, event.target.files[0]).then((snapshot) => {
         console.log('Uploaded a blob or file!');
         console.log('snapshot.ref.fullPath', snapshot.ref.fullPath);
         let startURL = devSettings === 'PRODUCTION' ? `gs://` : `http://127.0.0.1:9199/v0/b/`;
         //http://127.0.0.1:9199/v0/b/stockholm-city-affarsnatverk.appspot.com/o/websites%2F-N_r3h15dd1OQXZWLKfT%2FhomepageContent%2FpitchCards%2F-N_r9mmYWHD0KBuSellp?alt=media&token=a874d060-2012-488e-ab23-8de5239b722c

         const updateObject: any = {};
         updateObject[`websites/${WEBSITE_ID}/homepageContent/${sectionID}/id/`] = `${sectionID}`;
         updateObject[`websites/${WEBSITE_ID}/homepageContent/${sectionID}/sectionName/`] = `${sectionName}`;
         //updateObject[`websites/${WEBSITE_ID}/homepageContent/${sectionID}/order/`] = `${sectionOrder}`;
         updateObject[`websites/${WEBSITE_ID}/homepageContent/${sectionID}/updatedAt/`] = new Date();
         updateObject[`websites/${WEBSITE_ID}/homepageContent/${sectionID}/content/${randomkey}/`] = {
            //Portential error: content/items has to be used
            image: `${startURL}${storage.app.options.storageBucket}/o/${encodeURIComponent(
               snapshot.ref.fullPath
            )}?alt=media&token=${snapshot.metadata.downloadTokens}`,
            order: cardOrderNr,
            id: randomkey,
         };
         update(dbRef(db), updateObject);
      });
   }
}

export function ImageButtonFileUpload(props: ParticipantCardFileUploadProps): JSX.Element {
   const { cardOrderNr, sectionName, sectionID } = props;

   return (
      <Button variant="contained" sx={{ whiteSpace: 'nowrap', minWidth: 'max-content' }} /* component="label" */>
         Upload new image
         {/*<input hidden accept="image/*" type="file" onChange={(e) => handleFileUpload({ event: e, cardOrderNr: cardOrderNr, sectionName: sectionName, sectionID: sectionID })} />*/}
         <input
            hidden
            accept="image/*"
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
               advancedFileUpload({ event: e, cardOrderNr: cardOrderNr, sectionName: sectionName, sectionID: sectionID })
            }
         />
         ;
      </Button>
   );
}
interface EditorOfImagesProps extends ImgCardFileUploadProps {
   image: string | undefined;
}
export function EditorOfImage(props: EditorOfImagesProps) {
   const { image, sectionID, cardOrderNr, sectionName, className } = props;
   return (
      <Box
         minHeight="10rem"
         sx={{
            textAlign: 'center',
            width: '100%',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3,
            marginBottom: '2rem',
         }}
      >
         <Box
            sx={{
               textAlign: 'center',
               position: 'absolute',
               zIndex: 1,
            }}
         >
            <SvgIcon component={AddPhotoAlternateIcon} fontSize="large" />
            <br></br>
            <ImageButtonFileUpload sectionID={sectionID} sectionName={sectionName} cardOrderNr={cardOrderNr} />
         </Box>
         <img className={className} src={image} />
      </Box>
   );
}
