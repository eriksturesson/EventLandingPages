import { deleteObject, ref, uploadBytes } from 'firebase/storage';
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
import { Box, Button, Divider, SvgIcon, TextField } from '@mui/material';
import { SectionTypes } from '../interfaces/sectionInterfaces';

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

export function ImageButtonFileUpload(props: ParticipantCardFileUploadProps): JSX.Element {
   const { cardOrderNr, sectionName, sectionID } = props;
   function handleChange(event: any) {
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
   return (
      <Button variant="contained" sx={{ whiteSpace: 'nowrap', minWidth: 'max-content' }} /* component="label" */>
         Upload new image
         <input hidden accept="image/*" type="file" onChange={handleChange} />
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
