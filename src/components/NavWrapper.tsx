//import { BrowserRouter, Link, Route } from "react-router-dom";
//import { Navbar, Nav, Container } from 'react-bootstrap';
//import arrangerandeKlubbarHTML from "../"

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

import { Box, List, ListItem, Link} from '@mui/material';

const NavWrapper = ({ websiteID }: { websiteID: string }): JSX.Element => {
   return (
      <Box sx={{display: 'flex', justifyContent: 'flex-end', padding: 2}}className="eriks-nav-wrapper">
         <List sx={{display: 'flex', gap: 2, padding: 0}} className="right-menu-in-nav">
            <ListItem sx={{width: 'auto', padding: 0 }}>
               <Link href="/"underline ="none" sx={{color: 'black', textDecoration: 'none', '&:hover': {color: 'grey', textDecorationColor: 'grey', borderBottom: '2px solid grey'}}}>Home</Link>
            </ListItem>
            <ListItem sx={{width: 'auto', padding: 0 }}>
               <Link href="./tidigareprogram" underline="none" sx={{color: 'inherit', textDecoration: 'none', '&:hover': {color: 'grey', textDecorationColor: 'grey', borderBottom: '2px solid grey'}}}>Föregående år</Link>
            </ListItem>
            <ListItem sx={{width: 'auto', padding: 0 }}>
               <Link href="./arrangerandeklubbar" underline = "none" sx={{color: 'inherit', textDecoration: 'none', '&:hover': {color: 'grey', textDecorationColor: 'grey', borderBottom: '2px solid grey'}}}>Arrangörer</Link>
            </ListItem>
         </List>
      </Box>
   );
};

export default NavWrapper;
