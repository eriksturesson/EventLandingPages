//import { BrowserRouter, Link, Route } from "react-router-dom";
//import { Navbar, Nav, Container } from 'react-bootstrap';
//import arrangerandeKlubbarHTML from "../"

import { Box, Button, Link } from '@mui/material';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

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
   return (
      <Box sx={{ flexGrow: 1 }}>
         <AppBar position="static">
            <Toolbar variant="dense">
               <Button component="a" href="/" target="_blank" rel="noopener noreferrer">
                  Home
               </Button>
               <Link href="/">Home</Link>
               <Link href="./tidigareprogram">Föregående år</Link>
               <Link href="./arrangerandeklubbar">Arrangörer</Link>
               <Typography variant="h6" color="inherit" component="div">
                  Photos
               </Typography>

               <Typography variant="h6" color="inherit" component="div">
                  Photos
               </Typography>
            </Toolbar>
         </AppBar>
      </Box>
   );
};

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
