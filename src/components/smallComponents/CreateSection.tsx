import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, Button, Divider, Modal, Typography } from '@mui/material';
import { child, ref as dbRef, push, update } from 'firebase/database';
import React from 'react';
import { WEBSITE_ID } from '../../App';
import { SectionTypes, sectionTypes } from '../interfaces/sectionInterfaces';
import { db } from '../utils/firebase';
export function storeNewSection(sectionType: SectionTypes, sectionOrder: number) {
   let sectionID = push(child(dbRef(db), `websites/${WEBSITE_ID}/homepageContent/`)).key;
   update(dbRef(db, `websites/${WEBSITE_ID}/homepageContent/${sectionID}/`), {
      sectionName: sectionType,
      //content: initSectionDataOnNewCreation[sectionType], //No, create your own content later - dont create stuff that you need to remove.
      sectionID: sectionID,
      sectionOrder: sectionOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
   });
}

const modalStyle = {
   position: 'absolute' as 'absolute',
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   width: 400,
   bgcolor: 'background.paper',
   borderRadius: '12px',
   border: '2px solid #000',
   boxShadow: 24,
   p: 4,
};

export function CreateSection({ sectionOrder }: { sectionOrder: number }) {
   const [open, setOpen] = React.useState(false);
   const handleOpen = () => setOpen(true);
   const handleClose = () => setOpen(false);

   const allSections: JSX.Element[] = sectionTypes.map((sectionType: SectionTypes, i) => {
      return (
         <Box sx={{ alignItems: 'center' }} key={i}>
            <Button
               sx={{
                  backgroundColor: 'white',
                  float: 'left',
                  border: '1px solid black',
                  marginTop: '1rem',
                  marginBottom: '1rem',
                  marginLeft: '1rem',
                  marginRight: '1rem',
               }}
               onClick={() => storeNewSection(sectionType, sectionOrder)}
            >
               {sectionType}

               <AddCircleIcon />
            </Button>
         </Box>
      );
   });
   return (
      <Divider>
         <Box
            sx={{
               borderRadius: '16px',
               marginTop: '4rem',
               marginBottom: '4rem',
               marginLeft: '4rem',
               marginRight: '4rem',
               paddingLeft: '4rem',
               color: 'white',
               paddingRight: '4rem',
               background: '#1976d2',
               '&:hover': {
                  border: '1px solid black',
                  color: 'gray',
                  backgroundColor: '#1769aa',
               },
               textAlign: 'center',
               border: 'solid 2px black',
            }}
         >
            <Button sx={{ type: 'large', color: 'white' }} onClick={handleOpen}>
               <h2>Create new Section</h2>
            </Button>
            <Modal
               open={open}
               onClose={handleClose}
               aria-labelledby="modal-createSection-title"
               aria-describedby="modal-createSection-sectionTypes"
            >
               <Box sx={modalStyle}>
                  <Typography id="modal-createSection-title" variant="h6" component="h2">
                     Choose section to create:
                  </Typography>
                  <Box sx={{ mt: 2 }} id="modal-createSection-sectionTypes">
                     {allSections}
                  </Box>
               </Box>
            </Modal>
         </Box>
      </Divider>
   );
}
