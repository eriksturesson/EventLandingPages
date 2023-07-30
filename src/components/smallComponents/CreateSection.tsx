import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, Button, Divider, Fab, Modal, Typography } from '@mui/material';
import { SectionTypes, sectionTypes } from '../interfaces/sectionInterfaces';
import { update, ref as dbRef, push, child } from 'firebase/database';
import { db } from '../utils/firebase';
import { WEBSITE_ID } from '../../App';
import { initSectionDataOnNewCreation } from '../utils/initData';
export function storeNewSection(sectionType: SectionTypes, sectionOrder: number) {
   let sectionID = push(child(dbRef(db), `websites/${WEBSITE_ID}/homepageContent/`)).key;
   update(dbRef(db, `websites/${WEBSITE_ID}/homepageContent/${sectionID}/`), {
      sectionName: sectionType,
      content: initSectionDataOnNewCreation[sectionType],
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
   border: '2px solid #000',
   boxShadow: 24,
   p: 4,
};

export function BasicModal(sectionOrder: number) {
   const [open, setOpen] = React.useState(false);
   const handleOpen = () => setOpen(true);
   const handleClose = () => setOpen(false);

   const allSections: JSX.Element[] = sectionTypes.map((sectionType: SectionTypes) => {
      return (
         <Button onClick={() => storeNewSection(sectionType, sectionOrder)}>
            {sectionType}

            <AddCircleIcon />
         </Button>
      );
   });
   return (
      <div>
         <Button onClick={handleOpen}>Create Section</Button>
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
      </div>
   );
}
