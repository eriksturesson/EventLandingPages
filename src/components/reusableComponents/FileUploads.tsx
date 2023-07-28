import { deleteObject, ref, uploadBytes } from 'firebase/storage';
import { DBHomePageContentPitchCards, DBOneParticipant, DBParticipantKey } from '../utilsAndInterfaces/dbInterfaces';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import { child, push, update, ref as dbRef, set } from 'firebase/database';
import { db, devSettings, storage } from '../utilsAndInterfaces/firebase';
import { WEBSITE_ID } from '../../App';
import { useState } from 'react';
import { Box, Button, Divider, SvgIcon, TextField } from '@mui/material';

export interface ParticipantCardFileUploadProps {
   cardOrderNr: number;
   sectionName: 'participants' | 'organizers' | 'speakers' | 'pitchCards';
}

export function ImageCardFileUpload(props: ParticipantCardFileUploadProps): JSX.Element {
   const { cardOrderNr, sectionName } = props;
   function handleChange(event: any) {
      //setFile(event.target.files[0])
      let randomkey = push(child(dbRef(db), `websites/${WEBSITE_ID}/homepageContent/${sectionName}`)).key;
      const pitchCardRef = ref(storage, `websites/${WEBSITE_ID}/homepageContent/${sectionName}/${randomkey}`);
      // 'file' comes from the Blob or File API
      uploadBytes(pitchCardRef, event.target.files[0]).then((snapshot) => {
         console.log('Uploaded a blob or file!');
         console.log('snapshot.ref.fullPath', snapshot.ref.fullPath);
         let startURL = devSettings === 'PRODUCTION' ? `gs://` : `http://127.0.0.1:9199/v0/b/`;
         //http://127.0.0.1:9199/v0/b/stockholm-city-affarsnatverk.appspot.com/o/websites%2F-N_r3h15dd1OQXZWLKfT%2FhomepageContent%2FpitchCards%2F-N_r9mmYWHD0KBuSellp?alt=media&token=a874d060-2012-488e-ab23-8de5239b722c
         update(dbRef(db, `/websites/${WEBSITE_ID}/homepageContent/${sectionName}/` + randomkey), {
            image: `${startURL}${storage.app.options.storageBucket}/o/${encodeURIComponent(
               snapshot.ref.fullPath
            )}?alt=media&token=${snapshot.metadata.downloadTokens}`, //pitchCardRef.fullPath, // url to storage
            //title: string;
            //description: string;
            id: randomkey,
            order: cardOrderNr,
         });
      });
   }
   return (
      <Box>
         <Button className="uploadImageButton" variant="contained" component="label">
            Upload new image
            <input hidden accept="image/*" type="file" onChange={handleChange} />
         </Button>
      </Box>
   );
}
