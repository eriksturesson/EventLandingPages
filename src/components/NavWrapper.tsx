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

const NavWrapper = ({ websiteID }: { websiteID: string }): JSX.Element => {
   return (
      <div className="eriks-nav-wrapper">
         <ul className="right-menu-in-nav">
            <li>
               <a href="/">Home</a>
            </li>
            <li>
               <a href="./tidigareprogram">Föregående år</a>
            </li>
            <li>
               <a href="./arrangerandeklubbar">Arrangörer</a>
            </li>
         </ul>
      </div>
   );
};

export default NavWrapper;