import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, Divider } from '@mui/material';
import { ref, set } from 'firebase/database';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { WEBSITE_ID } from '../../App';
import { QuillContent } from '../interfaces/dbInterfaces';
import { SectionProps } from '../interfaces/sectionInterfaces';
import { auth, db } from '../utils/firebase';

function saveQuillToDB(data: any, sectionID: string) {
   console.log(data);
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
   set(ref(db, `websites/${WEBSITE_ID}/homepageContent/${sectionID}/content/quillContent`), {
      text: data,
      timestamp: timeSavedData,
   });

   // Insert log to database //
   if (auth.currentUser) {
      set(ref(db, 'adminUsers/' + auth.currentUser.uid), {
         websiteID: WEBSITE_ID,
         Email: auth.currentUser.email,
         LastTimeSavedData: timeSavedData,
      });
   }
}

export function QuillComponent(props: SectionProps): JSX.Element {
   const { data, adminEditor } = props;
   const { sectionName, sectionID, sectionOrder, createdAt, updatedAt } = data;
   let quillContent = data.content as QuillContent;
   console.log('quillContent', quillContent);

   const [value, setValue] = useState(quillContent && quillContent.text ? quillContent.text : ''); // Initialize with an empty string

   if (adminEditor) {
      return (
         <>
            <Divider>
               <h2>Edit Texts on your webpage</h2>
            </Divider>
            <div className="myquillComponent">
               <ReactQuill theme="snow" value={value} onChange={setValue} />
               <div
                  style={{
                     justifyContent: 'center',
                     display: 'flex',
                     marginTop: '1rem',
                  }}
               >
                  <Button variant="contained" onClick={() => saveQuillToDB(value, sectionID)} endIcon={<SaveIcon />}>
                     Save
                  </Button>
               </div>
            </div>
         </>
      );
   } else {
      return <Box sx={{ justifyContent: 'center', display: 'flex' }} dangerouslySetInnerHTML={{ __html: value }}></Box>;
   }
}
