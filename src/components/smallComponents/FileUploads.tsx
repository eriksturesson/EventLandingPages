import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Box, Button, SvgIcon } from '@mui/material';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React from 'react';
import { WEBSITE_ID } from '../../App';
import addNewSpeakerExample from '../../assets/addNewSpeakerExample.png';
import briefcaseExample from '../../assets/briefcaseExample.png';
import companyExample from '../../assets/companyExample.png';
import logoExample from '../../assets/logoExample.png';
import mapImageExample from '../../assets/mapImageExample.png';
import { SectionTypes } from '../interfaces/sectionInterfaces';
import { storage } from '../utils/firebase';
import { readAndWriteToFirebase } from '../utils/firebaseFunctions';
import { fileType } from './fileType';

export interface ParticipantCardFileUploadProps {
   order: number;
   id?: string;
   sectionID: string;
   sectionName: SectionTypes;
}

interface ImgCardFileUploadProps {
   sectionID: string;
   order: number;
   sectionName: SectionTypes;
   className?: string;
   id: string;
}

export function NewImgBoxFileUpload(props: ImgCardFileUploadProps): JSX.Element {
   const { sectionID, order, sectionName, id } = props;
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
            marginTop: '2rem',
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
            <ImageButtonFileUpload sectionID={sectionID} sectionName={sectionName} order={order} id={id} />
         </Box>
         <img className={className} src={backgroundImg} />
      </Box>
   );
}

interface FileUploadProps extends ParticipantCardFileUploadProps {
   event: React.ChangeEvent<HTMLInputElement>;
}

export function fileUpload(props: FileUploadProps): void {
   const { event, order, sectionName, sectionID, id } = props;
   const file = event?.target?.files ? event.target.files[0] : null;
   let randomKeyOrOneItem;

   if (sectionName === 'fullScreenMedia') {
      randomKeyOrOneItem = fileType(file);
   } else {
      //If ID exists, we are probably replacing an existing image, otherwise create a new
      randomKeyOrOneItem = id;
   }
   if (file) {
      const storageRef = ref(
         storage,
         `websites/${WEBSITE_ID}/homepageContent/${sectionID}/content/${randomKeyOrOneItem}/${file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

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

               let data = {};
               let ref = '';
               if (sectionName === 'fullScreenMedia') {
                  data = { media: downloadURL, order: order, id: randomKeyOrOneItem, mediaType: fileType(file) };
                  ref = `websites/${WEBSITE_ID}/homepageContent/${sectionID}/content/`;
               } else {
                  data = { image: downloadURL, order: order, id: randomKeyOrOneItem };
                  ref = `websites/${WEBSITE_ID}/homepageContent/${sectionID}/content/${randomKeyOrOneItem}/`;
               }
               readAndWriteToFirebase({
                  method: 'update',
                  ref: ref,
                  data: data,
               }).then(() => {
                  return downloadURL;
               });
            });
         }
      );
   }
}

export function ImageButtonFileUpload(props: ParticipantCardFileUploadProps): JSX.Element {
   const { order, sectionName, sectionID, id } = props;
   return (
      <Button variant="contained" sx={{ whiteSpace: 'nowrap', minWidth: 'max-content' }} /* component="label" */>
         <label htmlFor={`fileInput-${sectionID}-${id}`} style={{ cursor: 'pointer' }}>
            Upload new image
         </label>
         {/*<input hidden accept="image/*" type="file" onChange={(e) => handleFileUpload({ event: e, order: order, sectionName: sectionName, sectionID: sectionID })} />*/}
         <input
            id={`fileInput-${sectionID}-${id}`}
            hidden
            accept="image/*"
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
               fileUpload({ event: e, order: order, sectionName: sectionName, sectionID: sectionID, id: id })
            }
         />
      </Button>
   );
}
interface EditorOfImagesProps extends ImgCardFileUploadProps {
   image: string | undefined;
}
export function EditorOfImage(props: EditorOfImagesProps) {
   const { image, sectionID, order, sectionName, className, id } = props;
   if (!image) return <NewImgBoxFileUpload sectionID={sectionID} order={order} sectionName={sectionName} id={id} />;
   return (
      <Box
         minHeight="10rem"
         sx={{
            textAlign: 'center',
            mt: '2rem',
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
            <ImageButtonFileUpload sectionID={sectionID} sectionName={sectionName} order={order} id={id} />
         </Box>
         <img className={className} src={image} />
      </Box>
   );
}
