import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditNoteIcon from '@mui/icons-material/EditNote';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Button, Drawer, IconButton, List, ListItem, ListItemText, Modal, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDbContent } from '../contexts/DBContentContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { PageMetadata } from '../interfaces/dbInterfaces';
import { readAndWriteToFirebase } from '../utils/firebaseFunctions';
const modalStyle = {
   position: 'absolute' as const,
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   width: 400,
   bgcolor: 'background.paper',
   boxShadow: 24,
   borderRadius: 2,
   p: 4,
};

const NavWrapper = ({
   isAdmin,
   setPageToEdit,
}: {
   isAdmin: boolean;
   setPageToEdit?: React.Dispatch<React.SetStateAction<string | null>>;
}): JSX.Element => {
   const { customPageMetaData, setCustomPagesMetaData, websiteID } = useDbContent();
   const { siteSettings } = useSiteSettings();
   const [menuOpen, setMenuOpen] = useState(false);
   const [modalOpen, setModalOpen] = useState(false);
   const [isEditMode, setIsEditMode] = useState(false);
   const [editingItemID, setEditingItemID] = useState<string | null>(null);
   const [newItem, setNewItem] = useState<PageMetadata>({ pageName: '', pageLink: '', pageID: '' });

   const toggleDrawer = () => setMenuOpen(!menuOpen);

   const openModal = (item?: PageMetadata) => {
      if (item) {
         setIsEditMode(true);
         setEditingItemID(item.pageID);
         setNewItem(item);
      } else {
         setIsEditMode(false);
         setEditingItemID(null);
         setNewItem({ pageName: '', pageLink: '', pageID: '' });
      }
      setModalOpen(true);
   };

   const removeItem = async () => {
      if (!editingItemID) return;
      try {
         await readAndWriteToFirebase({
            method: 'remove',
            ref: `websites/${websiteID}/customPages/${editingItemID}/`,
         });

         setCustomPagesMetaData(customPageMetaData.filter((item) => item.pageID !== editingItemID));
         setModalOpen(false);
      } catch (error) {
         console.error('Error removing item:', error);
      }
   };

   const handleSaveItem = async () => {
      if (!newItem.pageName || !newItem.pageLink) return;

      const isNew = !isEditMode;
      const pageID = isNew ? uuidv4() : editingItemID!;
      const itemToSave = { ...newItem, pageID };

      try {
         await readAndWriteToFirebase({
            method: 'update',
            ref: `websites/${websiteID}/customPages/${pageID}/metadata/`,
            data: itemToSave,
         });

         if (isNew) {
            setCustomPagesMetaData([...customPageMetaData, itemToSave]);
         } else {
            const updated = customPageMetaData.map((item) => (item.pageID === pageID ? itemToSave : item));
            setCustomPagesMetaData(updated);
         }

         setModalOpen(false);
      } catch (error) {
         console.error('Error saving item:', error);
      }
   };

   return (
      <Box
         sx={{
            backgroundColor: 'transparent',
            backdropFilter: 'blur(8px)',

            paddingBottom: 0,
            flexGrow: 1,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            position: 'relative',
         }}
      >
         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, height: '60px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
               <Box sx={{ backgroundColor: 'white', py: 0.5, borderRadius: 3, pt: 0, pb: 0 }}>
                  <img src={siteSettings?.logoUrl ?? ''} alt="logo" style={{ width: 'auto', height: '40px' }} />
               </Box>
            </Box>

            {/* Desktop Menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
               {isAdmin && (
                  <Button startIcon={<AddIcon />} variant="contained" onClick={() => openModal()}>
                     Add Link
                  </Button>
               )}
               <Button
                  key={'homepage'}
                  component={isAdmin ? 'button' : 'a'}
                  onClick={
                     isAdmin
                        ? () => {
                             if (setPageToEdit) setPageToEdit(null);
                          }
                        : undefined
                  }
                  href={isAdmin ? undefined : '/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                     border: isAdmin ? '1px solid black' : 'none',
                     color: 'black',
                     fontWeight: 'bold',
                     textTransform: 'none',
                     '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.1)',
                     },
                  }}
               >
                  Home
               </Button>
               {customPageMetaData.map((item) => (
                  <Box key={item.pageID} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     <Button
                        key={item.pageID}
                        startIcon={isAdmin ? <EditIcon /> : null}
                        component={isAdmin ? 'button' : 'a'}
                        onClick={isAdmin ? () => openModal(item) : undefined}
                        href={isAdmin ? undefined : item.pageLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                           border: isAdmin ? '1px solid black' : 'none',
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
                     {isAdmin && (
                        <IconButton
                           size="small"
                           onClick={(e) => {
                              e.stopPropagation(); // Förhindra att föräldrarklick triggas
                              if (setPageToEdit) setPageToEdit(item.pageID);
                           }}
                        >
                           <EditNoteIcon />
                        </IconButton>
                     )}
                  </Box>
               ))}
            </Box>

            {/* Mobile Menu Icon */}
            <IconButton
               sx={{
                  display: { xs: 'flex', md: 'none' },
                  color: 'black',
                  border: '1px solid black',
                  borderRadius: '12px',
                  p: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
               }}
               onClick={toggleDrawer}
            >
               <MenuIcon fontSize="medium" />
            </IconButton>

            {/* Drawer (Mobile Menu) */}
            <Drawer
               anchor="right"
               open={menuOpen}
               onClose={toggleDrawer}
               PaperProps={{
                  sx: { width: 250, backgroundColor: 'primary.main', color: 'white' },
               }}
            >
               <List>
                  {isAdmin && (
                     <ListItem>
                        <Button
                           startIcon={<AddIcon />}
                           variant="contained"
                           color="success"
                           onClick={() => {
                              toggleDrawer();
                              openModal();
                           }}
                        >
                           Create page
                        </Button>
                     </ListItem>
                  )}
                  {customPageMetaData.map((item) => (
                     <ListItem
                        key={item.pageID}
                        component="a"
                        href={isAdmin ? undefined : item.pageLink}
                        onClick={isAdmin ? () => openModal(item) : undefined}
                     >
                        {isAdmin ? <EditIcon sx={{ mr: 1 }} /> : null}
                        <ListItemText primary={item.pageName} />
                        {isAdmin && (
                           <IconButton
                              size="small"
                              onClick={(e) => {
                                 e.stopPropagation(); // Förhindra att föräldrarklick triggas
                                 if (setPageToEdit) setPageToEdit(item.pageID);
                              }}
                           >
                              <EditNoteIcon />
                           </IconButton>
                        )}
                     </ListItem>
                  ))}
               </List>
            </Drawer>
         </Box>

         {/* Modal */}
         {isAdmin && (
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
               <Box sx={modalStyle}>
                  <Typography variant="h6" mb={2}>
                     {isEditMode ? 'Edit link' : 'Add new link'}
                  </Typography>
                  <TextField
                     fullWidth
                     label="Name"
                     variant="outlined"
                     value={newItem.pageName}
                     onChange={(e) => setNewItem({ ...newItem, pageName: e.target.value })}
                     sx={{ mb: 2 }}
                  />
                  <TextField
                     fullWidth
                     label="Link"
                     variant="outlined"
                     value={newItem.pageLink}
                     onChange={(e) => setNewItem({ ...newItem, pageLink: e.target.value })}
                     sx={{ mb: 2 }}
                  />
                  {isEditMode && (
                     <Button
                        sx={{ mt: 2, mb: 2 }}
                        startIcon={<DeleteIcon />}
                        color="error"
                        fullWidth
                        variant="contained"
                        onClick={removeItem}
                     >
                        Remove
                     </Button>
                  )}
                  <Button fullWidth variant="contained" onClick={handleSaveItem}>
                     {isEditMode ? 'Save changes' : 'Add link'}
                  </Button>
               </Box>
            </Modal>
         )}
      </Box>
   );
};

export default NavWrapper;
