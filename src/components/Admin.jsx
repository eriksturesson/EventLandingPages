import React, { useEffect, useState } from "react";
import { db } from "./utilsAndInterfaces/firebase";
import { ref, onValue, set } from "firebase/database";
import { signOut } from "firebase/auth";
import { auth } from "./utilsAndInterfaces/firebase";
import { QuillComponent } from "./Quill";
import Home, { initialState } from "./Home";
import Button from "@mui/material/Button";
import NavWrapper from "./NavWrapper";
import Footer from "./Footer";
import { EditRegisterButtonComponent } from "./RegisterButton";
import { Box } from "@mui/material";
import { PitchCardsComponent } from "./PitchCards";
// Get user data //
var name, email, photoUrl, uid, emailVerified;
function signOutUser() {
    // SIGN OUT USER //
    signOut(auth).then(() => {
        // Sign-out successful.
        //window.location.href = "login"; //This is handled in App.tsx
    }).catch((error) => {
        // An error happened.
    });
}
/* EDIT TEXT FROM ADMIN */
/* One function for all elements to edit textContent */
let currentTextToEdit = "";
let newTextContent = "";
function editTextContent(edit_id, showing_id) {
    // I need the ID of input-field named the same but without "button" in the beginning
    const str = String(edit_id);
    const inputID = str.replace("button", "");
    const currentInner = document.getElementById(showing_id).innerHTML;
    const currentOuter = document.getElementById(showing_id).outerHTML;
    if (currentInner.includes("strong")) {
        let currentTextToEdit = document.getElementById(inputID).value;
        document.getElementById(showing_id).innerHTML = "<strong>" + currentTextToEdit + "</stong>";
        console.log(currentTextToEdit);
    }
    else if (currentOuter.includes("</p>")) {
        let currentTextToEdit = document.getElementById(inputID).value;
        document.getElementById(showing_id).innerHTML = '"' + currentTextToEdit + '"';
        console.log(currentTextToEdit);
    }
    else {
        let currentTextToEdit = document.getElementById(inputID).value;
        document.getElementById(showing_id).innerHTML = currentTextToEdit;
        console.log(currentTextToEdit);
    }
}
// SAVE TO DATABASE
function saveDataToFirebase() {
    let adminJSTextContent = document.getElementById("adminTextContent").innerHTML;
    console.log(adminJSTextContent);
    let currentdate = new Date();
    let timeSavedData = currentdate.getFullYear() + "-" + currentdate.getMonth() + "-" + currentdate.getDate() + ":" + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    console.log(timeSavedData);
    // Insert text to database 
    set(ref(db, "Program"), {
        "ProgramContent": adminJSTextContent,
        "Timestamp": timeSavedData
    });
    // Insert log to database //
    set(ref(db, "users/" + uid), {
        "Email": email,
        "LastTimeSavedData": timeSavedData,
    });
}
function loadDBContent() {
    // READ DATA WHEN UPDATED TO UPDATE INDEX.HTML PROGRAM CONTENT
    let readContentFromDatabaseRef = ref(db, 'Program/ProgramContent');
    let updateAdminWebsiteContent = document.getElementById("readDatabaseContentForAdmin");
    //let databaseContent = document.getElementByClassName('DBContent');
    let data = "";
    //if ((document.getElementById("firstProgramHeader") as HTMLInputElement).value == undefined) {
    onValue(readContentFromDatabaseRef, (snapshot) => {
        data = snapshot.val();
        if (data !== null) {
            return <>{data}</>;
            //(document.getElementById("adminTextContent") as HTMLElement).innerHTML = data;
            // let databaseContent = document.getElementByClassName('DBContent')[0].innerHTML = data;
            // console.log(databaseContent);
        }
        else {
            //alert('There is no text to get');
            return <>{data}</>;
        }
    });
    return <>{data}</>;
    //}
}
;
export const Admin = ({ user, websiteID }) => {
    const [homepageContent, setProgramContent] = useState(initialState);
    //let databaseContent = document.getElementByClassName('DBContent');
    useEffect(() => {
        // READ DATA WHEN UPDATED TO UPDATE INDEX.HTML PROGRAM CONTENT
        let readContentFromDatabaseToIndex = ref(db, `websites/${websiteID}/homepageContent`);
        onValue(readContentFromDatabaseToIndex, (snapshot) => {
            let programContentFromDB = snapshot.val() ? snapshot.val() : "";
            if (programContentFromDB)
                setProgramContent(programContentFromDB);
        });
    }, [homepageContent]);
    return (<>
      <form>
        <Button variant="outlined" onClick={signOutUser} id="signout">
          Sign out
        </Button>
      </form>
      <h1>Redigera program, talare och tider</h1>
      <p>UserEmail: {user ? user.email : null}</p>
      <br />
      <Box className="adminEdit" id="adminEditWrapper">
        <Box id="changeOrCreateNewPageToEdit">

        </Box>
        <Box id="editRegisterButton">
          <EditRegisterButtonComponent buttonContent={homepageContent.button} websiteID={websiteID}/>
        </Box>
        <Box id="editHeader">

        </Box>
        <Box id="editPitchCards" alignContent={"center"}>
          <PitchCardsComponent adminEdit={true} pitchCards={homepageContent.pitchCards}/>
        </Box>
        <Box id="myQuillComponent">
          <QuillComponent websiteID={websiteID} quillContent={homepageContent.quillContent}/>
        </Box>
        <Box id="editFooter">

        </Box>
      </Box>
      <Box>
        <h1>Detta syns nu på webbsidan:</h1>
      </Box>
      <Box id="readDatabaseContentForAdmin" className="DBContent">
        <NavWrapper websiteID={websiteID}/>
        <Home websiteID={websiteID}/>
        <Footer websiteID={websiteID}/>
      </Box>

    </>);
};
