//import { BrowserRouter, Link, Route } from "react-router-dom";
//import { Navbar, Nav, Container } from 'react-bootstrap';
//import arrangerandeKlubbarHTML from "../"

import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Button, Drawer, IconButton, List, ListItem, ListItemText, Modal, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import logga from '../assets/LOGGA FÄRDIGT UTKAST.jpg';
import { useDbContent } from '../contexts/DBContentContext';
import { PageMetadata } from '../interfaces/dbInterfaces';
import { readAndWriteToFirebase } from '../utils/firebaseFunctions';
const style = {
   position: 'absolute' as const,
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   width: 300,
   bgcolor: 'background.paper',
   boxShadow: 24,
   borderRadius: 2,
   p: 4,
};
const NavWrapper = ({ isAdmin }: { isAdmin: boolean }): JSX.Element => {
   const { customPageMetaData, setCustomPagesMetaData, websiteID } = useDbContent();
   const [menuOpen, setMenuOpen] = useState(false);
   const [modalOpen, setModalOpen] = useState(false);
   const [newItem, setNewItem] = useState<PageMetadata>({ pageName: '', pageLink: '', pageID: '' });
   const handleDrawerToggle = () => setMenuOpen(!menuOpen);
   const handleModalToggle = () => setModalOpen(!modalOpen);

   const handleAddItem = async () => {
      if (newItem.pageName && newItem.pageLink) {
         let newPageID = uuidv4();
         newItem.pageID = newPageID;
         //First update db
         try {
            await readAndWriteToFirebase({
               method: 'update',
               ref: `websites/${websiteID}/customPages/${newPageID}/metadata/`,
               data: newItem,
            });
            //If successful, also update state
            setCustomPagesMetaData([...customPageMetaData, newItem]);
            setModalOpen(false);
         } catch (error) {
            console.error('Error adding new item:', error);
         }
      }
   };

   return (
      <Box
         sx={{
            backgroundColor: 'transparent',
            backdropFilter: 'blur(8px)',
            marginTop: -1,
            marinLeft: 0,
            marginRight: 0,
            paddingBottom: 0,
            flexGrow: 1,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            position: 'relative',
         }}
      >
         <Box
            sx={{
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'space-between',
               paddingX: 2,
            }}
         >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
               <Box
                  sx={{
                     backgroundColor: 'white',
                     paddingX: '24px',
                     paddingY: '4px',
                     borderRadius: '12px',
                     display: 'inline-block',
                  }}
               >
                  <img src={logga} alt="Logo" style={{ width: '120px', height: '50px' }} />
               </Box>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
               {isAdmin && (
                  <Button startIcon={<AddIcon />} variant="contained" onClick={handleModalToggle}>
                     Add Link
                  </Button>
               )}
               {customPageMetaData.map((item) => (
                  <Button
                     key={item.pageID}
                     component="a"
                     href={item.pageLink}
                     target="_blank"
                     rel="noopener noreferrer"
                     sx={{
                        color: 'black',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        '&:hover': {
                           backgroundColor: 'rgba(0,0,0,0.1)',
                        },
                     }}
                  >
                     {item.pageName}
                  </Button>
               ))}
            </Box>
            <IconButton
               sx={{
                  display: { xs: 'flex', md: 'none' },
                  color: 'black',
                  border: '1px solid black',
                  borderRadius: '12px',
                  padding: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
               }}
               onClick={handleDrawerToggle}
            >
               <MenuIcon fontSize="medium" />
            </IconButton>
            <Drawer
               anchor="right"
               open={menuOpen}
               onClose={handleDrawerToggle}
               PaperProps={{
                  sx: { width: 250, backgroundColor: 'primary.main', color: 'white' },
               }}
            >
               <List>
                  {isAdmin && (
                     <IconButton
                        onClick={handleModalToggle}
                        sx={{
                           position: 'absolute',
                           top: 12,
                           right: 12,
                           backgroundColor: 'white',
                           border: '1px solid #ccc',
                           '&:hover': {
                              backgroundColor: '#eee',
                           },
                        }}
                     >
                        <AddIcon />
                     </IconButton>
                  )}
                  {customPageMetaData.map((item) => (
                     <ListItem button key={item.pageName} component="a" href={item.pageLink} onClick={handleDrawerToggle}>
                        <ListItemText primary={item.pageName} />
                     </ListItem>
                  ))}
               </List>
            </Drawer>
         </Box>

         {isAdmin && (
            <Modal open={modalOpen} onClose={handleModalToggle}>
               <Box
                  sx={{
                     position: 'absolute',
                     top: '50%',
                     left: '50%',
                     transform: 'translate(-50%, -50%)',
                     width: 400,
                     bgcolor: 'background.paper',
                     boxShadow: 24,
                     borderRadius: 2,
                     p: 4,
                  }}
               >
                  <Typography variant="h6" mb={2}>
                     Lägg till länk
                  </Typography>
                  <TextField
                     fullWidth
                     label="Namn"
                     variant="outlined"
                     value={newItem.pageName}
                     onChange={(e) => setNewItem({ ...newItem, pageName: e.target.value })}
                     sx={{ mb: 2 }}
                  />
                  <TextField
                     fullWidth
                     label="Länk"
                     variant="outlined"
                     value={newItem.pageLink}
                     onChange={(e) => setNewItem({ ...newItem, pageLink: e.target.value })}
                     sx={{ mb: 2 }}
                  />
                  <Button fullWidth variant="contained" onClick={handleAddItem}>
                     Lägg till
                  </Button>
               </Box>
            </Modal>
         )}
      </Box>
   );
};

export default NavWrapper;
