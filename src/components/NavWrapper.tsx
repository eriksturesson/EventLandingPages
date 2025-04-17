//import { BrowserRouter, Link, Route } from "react-router-dom";
//import { Navbar, Nav, Container } from 'react-bootstrap';
//import arrangerandeKlubbarHTML from "../"

import { Box, Button, Drawer, IconButton, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logga from '../assets/LOGGA FÄRDIGT UTKAST.jpg';
import { useState } from 'react';

/*
            <div className="right-menu-in-nav" id="reactNavbar">
                <Navbar bg="primary" variant="dark">
                    <Container>
                        <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link href="/home">Home</Nav.Link>
                            <Nav.Link href="./ArrangerandeKlubbar">Arrangerande klubbar</Nav.Link>
                            <Nav.Link href="#pricing">Pricing</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
            </div>

*/

const NavWrapper = ({ websiteID }: { websiteID: string }): JSX.Element => {
   const menuItems = [
      { label: 'Home', link: '/' },
      { label: 'Föregående år', link: './tidigareprogram' },
      { label: 'Arrangörer', link: './arrangerandeklubbar' },
   ];
   const [menuOpen, setMenuOpen] = useState(false);

   const handleDrawerToggle = () => {
      setMenuOpen(!menuOpen);
   };

   return (
      <Box sx={{ backgroundColor: 'primary.main', padding: 1, flexGrow: 1 }}>
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
                     borderRadius: '8px',
                     display: 'inline-block',
                  }}
               >
                  <img
                     src={logga}
                     alt="Logo"
                     style={{
                        width: '120px',
                        height: '50px',
                     }}
                  />
               </Box>
            </Box>
            <Box
               sx={{
                  display: { xs: 'none', md: 'flex' },
                  gap: 2,
               }}
            >
               {menuItems.map((item) => (
                  <Button
                     key={item.label}
                     component="a"
                     href={item.link}
                     target="_blank"
                     rel="noopener noreferrer"
                     sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        '&:hover': {
                           backgroundColor: 'primary.dark',
                        },
                     }}
                  >
                     {item.label}
                  </Button>
               ))}
            </Box>
            <IconButton sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }} onClick={handleDrawerToggle}>
               <MenuIcon />
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
                  {menuItems.map((item) => (
                     <ListItem button key={item.label} component="a" href={item.link} onClick={handleDrawerToggle}>
                        <ListItemText primary={item.label} />
                     </ListItem>
                  ))}
               </List>
            </Drawer>
         </Box>
      </Box>
   );
};

// Innan hamburgermenyn:
// const NavWrapper = ({ websiteID }: { websiteID: string }): JSX.Element => {
//    return (
//       <Box sx={{ backgroundColor: 'primary.main', padding: 1, flexGrow: 1 }}>
//          <Box
//             sx={{
//                display: 'flex',
//                alignItems: 'center',
//                justifyContent: 'space-between',
//                paddingX: 2,
//             }}
//          >
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                <Box
//                   sx={{
//                      backgroundColor: 'white',
//                      paddingX: '24px',
//                      paddingY: '4px',
//                      borderRadius: '8px',
//                      display: 'inline-block',
//                   }}
//                >
//                   <img
//                      src={logga}
//                      alt="Logo"
//                      style={{
//                         width: '120px',
//                         height: '50px',
//                         borderRadius: '0%',
//                      }}
//                   />
//                </Box>
//             </Box>

//             <Box sx={{ display: 'flex', gap: 2 }}>
//                <Button
//                   component="a"
//                   href="/"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   sx={{
//                      color: 'white',
//                      fontWeight: 'bold',
//                      textTransform: 'none',
//                      '&:hover': {
//                         backgroundColor: 'primary.dark',
//                      },
//                   }}
//                >
//                   Home
//                </Button>

//                <Button
//                   component="a"
//                   href="./tidigareprogram"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   sx={{
//                      color: 'white',
//                      fontWeight: 'bold',
//                      textTransform: 'none',
//                      '&:hover': {
//                         backgroundColor: 'primary.dark',
//                      },
//                   }}
//                >
//                   Föregående år
//                </Button>

//                <Button
//                   component="a"
//                   href="./arrangerandeklubbar"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   sx={{
//                      color: 'white',
//                      fontWeight: 'bold',
//                      textTransform: 'none',
//                      '&:hover': {
//                         backgroundColor: 'primary.dark',
//                      },
//                   }}
//                >
//                   Arrangörer
//                </Button>
//             </Box>
//          </Box>
//       </Box>
//    );
// };

// return (
//    <Box >
//       <ul >
//          <li>
//             <a href="/">Home</a>
//          </li>
//          <li>
//             <a href="./tidigareprogram">Föregående år</a>
//          </li>
//          <li>
//             <a href="./arrangerandeklubbar">Arrangörer</a>
//          </li>
//       </ul>
//    </Box>
// );

export default NavWrapper;
