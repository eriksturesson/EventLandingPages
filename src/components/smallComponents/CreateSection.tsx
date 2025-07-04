import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, Button, Divider, Grid, Modal, Typography } from '@mui/material';
import { child, ref as dbRef, push, update } from 'firebase/database';
import { useState } from 'react';
import { useDbContent } from '../../contexts/DBContentContext';
import { SectionTypes, sectionTypes } from '../../interfaces/sectionInterfaces';
import { db } from '../../utils/firebase';

export interface CreateSectionProps {
   sectionType: SectionTypes;
   sectionOrder: number;
   websiteID?: string;
   pageID: string | null;
}
export function storeNewSection(props: CreateSectionProps) {
   const { sectionType, sectionOrder, websiteID, pageID } = props;

   const dbRefStart = pageID
      ? `websites/${websiteID}/customPages/${pageID}/content/`
      : `websites/${websiteID}/homepageContent/`;
   let sectionID = push(child(dbRef(db), dbRefStart)).key;
   update(dbRef(db, dbRefStart + sectionID), {
      sectionName: sectionType,
      //content: initSectionDataOnNewCreation[sectionType], //No, create your own content later - dont create stuff that you need to remove.
      sectionID: sectionID,
      sectionOrder: sectionOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
   });
}

export function CreateSection({ sectionOrder, pageID }: { sectionOrder: number; pageID: string | null }): JSX.Element {
   const { websiteID } = useDbContent();
   const [open, setOpen] = useState(false);
   const handleOpen = () => setOpen(true);
   const handleClose = () => setOpen(false);
   const smallScreen = window.innerWidth < 600;
   const allSections: JSX.Element[] = sectionTypes.map((sectionType: SectionTypes, i) => {
      return (
         <Grid sx={{ textAlign: 'center', pt: 2, pb: 2 }} item xs={12} sm={12} md={6} key={i}>
            <Button
               color="info"
               endIcon={<AddCircleIcon />}
               variant="contained"
               onClick={() => {
                  storeNewSection({ sectionType, sectionOrder, websiteID, pageID });
                  handleClose();
               }}
            >
               {sectionType}
            </Button>
         </Grid>
      );
   });
   return (
      <>
         <Divider sx={{ mb: '2rem', mt: '2rem' }}>
            <Box sx={{ pt: 2, pb: 2 }}>
               <Button endIcon={<AddCircleIcon />} variant="contained" size="large" onClick={handleOpen}>
                  {smallScreen ? 'New Section' : 'Create new Section'}
               </Button>
            </Box>
         </Divider>
         <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
         >
            <Box
               sx={{
                  maxHeight: '80vh', // limit height
                  overflow: 'auto', // enable scroll if content overflows
                  textAlign: 'center',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: 24,
                  p: 4,
               }}
            >
               <Typography id="modal-modal-title" variant="h6" component="h2">
                  Choose section to create:
               </Typography>
               <Divider sx={{ mb: '2rem', mt: '2rem' }} />
               <Grid container spacing={2}>
                  {allSections}
               </Grid>
            </Box>
         </Modal>
      </>
   );
}
