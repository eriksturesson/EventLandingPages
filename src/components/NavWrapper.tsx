//import { BrowserRouter, Link, Route } from "react-router-dom";
//import { Navbar, Nav, Container } from 'react-bootstrap';
//import arrangerandeKlubbarHTML from "../"

import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Button, Drawer, IconButton, List, ListItem, ListItemText, Modal, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import logga from '../assets/LOGGA FÄRDIGT UTKAST.jpg';
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
   const [menuItems, setMenuItems] = useState([
      { label: 'Home', link: '/' },
      { label: 'Föregående år', link: './tidigareprogram' },
      { label: 'Arrangörer', link: './arrangerandeklubbar' },
   ]);
   const [menuOpen, setMenuOpen] = useState(false);
   const [modalOpen, setModalOpen] = useState(false);
   const [newItem, setNewItem] = useState({ label: '', link: '' });
   const handleDrawerToggle = () => setMenuOpen(!menuOpen);
   const handleModalToggle = () => setModalOpen(!modalOpen);

   const handleAddItem = () => {
      if (newItem.label && newItem.link) {
         setMenuItems([...menuItems, newItem]);
         setNewItem({ label: '', link: '' });
         setModalOpen(false);
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
               {menuItems.map((item) => (
                  <Button
                     key={item.label}
                     component="a"
                     href={item.link}
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
                     {item.label}
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
                  {menuItems.map((item) => (
                     <ListItem button key={item.label} component="a" href={item.link} onClick={handleDrawerToggle}>
                        <ListItemText primary={item.label} />
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
                     value={newItem.label}
                     onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                     sx={{ mb: 2 }}
                  />
                  <TextField
                     fullWidth
                     label="Länk"
                     variant="outlined"
                     value={newItem.link}
                     onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
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
