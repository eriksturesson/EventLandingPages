import SaveIcon from '@mui/icons-material/Save';
import { Box, Button } from '@mui/material';
import { ref, set } from 'firebase/database';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDbContent } from '../../contexts/DBContentContext';
import { QuillContent } from '../../interfaces/dbInterfaces';
import { SectionProps } from '../../interfaces/sectionInterfaces';
import { auth, db } from '../../utils/firebase';

function saveQuillToDB(data: any, sectionID: string, pageID: string | null): void {
   const { websiteID } = useDbContent();
   let currentdate = new Date();
   let timeSavedData =
      currentdate.getFullYear() +
      '-' +
      currentdate.getMonth() +
      '-' +
      currentdate.getDate() +
      ':' +
      currentdate.getHours() +
      ':' +
      currentdate.getMinutes() +
      ':' +
      currentdate.getSeconds();
   console.log(timeSavedData);

   // Insert text to database
   const path = pageID ? `customPages/${pageID}/content/${sectionID}/content/` : `homepageContent/${sectionID}/content/`;
   set(ref(db, `websites/${websiteID}/` + path), {
      text: data,
      timestamp: timeSavedData,
   });

   // Insert log to database //
   if (auth.currentUser) {
      set(ref(db, 'adminUsers/' + auth.currentUser.uid), {
         websiteID: websiteID,
         email: auth.currentUser.email,
         lastTimeSavedData: timeSavedData,
      });
   }
}

export function QuillComponent(props: SectionProps): JSX.Element {
   const { data, adminEditor, pageID } = props;
   const { sectionName, sectionID, sectionOrder, createdAt, updatedAt } = data;
   let quillContent = data.content as QuillContent | undefined;
   // console.log('quillContent', quillContent);

   const [value, setValue] = useState(quillContent && quillContent.text ? quillContent.text : ''); // Initialize with an empty string
   async function handleSave() {
      saveQuillToDB(value, sectionID, pageID);
      setValue(value);
   }
   if (adminEditor) {
      return (
         <>
            <div className="myquillComponent" style={{ textAlign: 'center', marginTop: '1rem' }}>
               <ReactQuill theme="snow" value={value} onChange={setValue} />
               <div
                  style={{
                     justifyContent: 'center',
                     display: 'flex',
                     marginTop: '1rem',
                  }}
               >
                  <Button variant="contained" onClick={handleSave} endIcon={<SaveIcon />}>
                     Save
                  </Button>
               </div>
            </div>
         </>
      );
   } else {
      return (
         <Box
            sx={{ justifyContent: 'center', display: 'flex' }}
            dangerouslySetInnerHTML={{ __html: `<div>${value}</div>` }}
         ></Box>
      );
   }
}
