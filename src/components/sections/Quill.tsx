import ReactQuill, { Quill } from 'react-quill';
import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { Button, Divider } from '@mui/material';
import { ref, set } from 'firebase/database';
import { auth, db } from '../utils/firebase';
import SaveIcon from '@mui/icons-material/Save';
import parse from 'html-react-parser';
import { SectionProps } from '../interfaces/sectionInterfaces';
import { QuillContent } from '../interfaces/dbInterfaces';
import { WEBSITE_ID } from '../../App';

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
   const quillContent = data.content as QuillContent;
   if (adminEditor) {
      const [value, setValue] = useState(quillContent.text);
      useEffect(() => {
         //QUILL Renders somehow before the initiation (so no text is visible in the quil editor from start even if there is text in the db) so useEffect is needed to put our quillContent to the quill editor
         setValue(quillContent.text);
      }, [quillContent]);
      return (
         <>
            <Divider>
               <h2>Edit Texts on your webpage</h2>
            </Divider>
            <div className="myquillComponent">
               <ReactQuill theme="snow" value={value} defaultValue={value} onChange={setValue} />
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
      return <>{quillContent && quillContent.text ? parse(quillContent.text) : <></>}</>;
   }
}
