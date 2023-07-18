import ReactQuill from 'react-quill';
import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@mui/material';
import { ref, set } from 'firebase/database';
import { auth, db } from './utilsAndInterfaces/firebase';
import SaveIcon from '@mui/icons-material/Save';
import parse from 'html-react-parser';
function saveQuillToDB(data, websiteID) {
    console.log(data);
    let currentdate = new Date();
    let timeSavedData = currentdate.getFullYear() + "-" + currentdate.getMonth() + "-" + currentdate.getDate() + ":" + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    console.log(timeSavedData);
    // Insert text to database 
    set(ref(db, `websites/${websiteID}/homepageContent`), {
        "quillContent": data,
        "timestamp": timeSavedData
    });
    // Insert log to database //
    if (auth.currentUser) {
        set(ref(db, "adminUsers/" + auth.currentUser.uid), {
            "websiteID": websiteID,
            "Email": auth.currentUser.email,
            "LastTimeSavedData": timeSavedData,
        });
    }
}
export function ShowQuillContent({ quillContent }) {
    const [value, setValue] = useState(quillContent);
    let quillContentToHTML = quillContent ? parse(quillContent) : <></>;
    return (<>
            {quillContentToHTML}
        </>);
}
export function QuillComponent({ websiteID, quillContent }) {
    const [value, setValue] = useState(quillContent);
    useEffect(() => {
        //QUILL Renders somehow before the initiation (so no text is visible in the quil editor from start even if there is text in the db) so useEffect is needed to put our quillContent to the quill editor
        setValue(quillContent);
    }, [quillContent]);
    return (<>
            <h1>Add more texts to your homepage:</h1>
            <div className='myquillComponent'>
                <ReactQuill theme="snow" value={value} defaultValue={value} onChange={setValue}/>
                <div style={{ justifyContent: "center", display: 'flex', marginTop: "1rem" }}>
                    <Button variant="contained" onClick={() => saveQuillToDB(value, websiteID)} endIcon={<SaveIcon />}>Save</Button>
                </div>
            </div>
        </>);
}
