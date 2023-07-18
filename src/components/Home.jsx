import React, { useEffect, useState } from 'react';
import { ref, onValue } from "firebase/database";
import { db } from './utilsAndInterfaces/firebase';
import { RegisterButtonComponent } from './RegisterButton';
import { HeaderComponent } from './Header';
import { PitchCardsComponent } from './PitchCards';
import { ShowQuillContent } from './Quill';
function testonload() {
    alert("testar onload i html-filen, då ska denna funktion köras");
}
export const initialState = {
    header: {
        logo: "",
        video: "",
        image: "",
    },
    pitchCards: [
        {
            image: "",
            title: "",
            description: "",
            order: 0
        },
    ],
    quillContent: "",
    button: {
        formLink: "link to form here (use 'https://' to link outside the webpage)",
        buttonText: "initial text",
        buttonInfo: "inital info",
        buttonColor: "green",
    },
    footer: {
        integrityPolicy: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        contactAddress1: "",
        contactAddress2: "",
        mapImage: "",
    },
    timestamp: "",
};
const Home = ({ websiteID }) => {
    const [homepageContent, setProgramContent] = useState(initialState);
    //let databaseContent = document.getElementByClassName('DBContent');
    useEffect(() => {
        // READ DATA WHEN UPDATED TO UPDATE PROGRAM CONTENT
        let readContentFromDatabaseToIndex = ref(db, `websites/${websiteID}/homepageContent`);
        onValue(readContentFromDatabaseToIndex, (snapshot) => {
            let programContentFromDB = snapshot.val() ? snapshot.val() : "";
            setProgramContent(programContentFromDB);
        });
    }, []);
    return (<div>
            <HeaderComponent header={homepageContent.header}/>
            <RegisterButtonComponent buttonContent={homepageContent.button}/>
            <PitchCardsComponent pitchCards={homepageContent.pitchCards}/>
            <RegisterButtonComponent buttonContent={homepageContent.button}/>
            <ShowQuillContent quillContent={homepageContent.quillContent}/>
            <RegisterButtonComponent buttonContent={homepageContent.button}/>
        </div>);
};
export default Home;
