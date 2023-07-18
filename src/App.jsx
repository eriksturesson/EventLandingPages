//import logo from './logo.svg';
import './App.css';
import './customStyles.css';
import { onAuthStateChanged } from "firebase/auth";
import NavWrapper from './components/NavWrapper';
import Home from './components/Home';
import { Admin } from './components/Admin';
import { Login } from './components/Login';
import ArrangerandeKlubbar from './components/ArrangerandeKlubbar';
import TidigareProgram from './components/TidigareProgram';
import Footer from './components/Footer';
import * as React from "react";
import { useState, useEffect } from "react";
import { auth } from "./components/utilsAndInterfaces/firebase";
import { handleWebSiteID } from "./components/utilsAndInterfaces/handleWebsiteID";
import { LoadingSpinner } from "./components/Loading";
const App = () => {
    const [logedIn, setLogedIn] = useState(null);
    //const [loading, setLoading] = useState<boolean>(true)
    const [websiteID, setWebsiteID] = useState("");
    //const [websiteID, setWebsiteID] = useState<string | null>(null)
    let userOrNull = auth.currentUser;
    useEffect(() => {
        const listener = onAuthStateChanged(auth, async (user) => {
            if (user) {
                userOrNull = user;
                setLogedIn(true);
            }
            else
                setLogedIn(false);
        });
        return () => {
            listener();
        };
    }, [logedIn]);
    useEffect(() => {
        handleWebSiteID().then(id => {
            setWebsiteID(id);
        });
    }, [websiteID]);
    console.log("websiteID at upstart", websiteID);
    console.log("logedIn at upstart", logedIn);
    if (websiteID === "" || logedIn === null)
        return <LoadingSpinner />;
    let page = window.location.href;
    console.log("page", page);
    console.log("logedIn", logedIn);
    if (page.includes('tidigareprogram')) {
        return (<>
        <NavWrapper websiteID={websiteID}/>
        <TidigareProgram />
        <Footer websiteID={websiteID}/>
      </>);
    }
    else if (page.includes('arrangerandeklubbar')) {
        return (<>
        <NavWrapper websiteID={websiteID}/>
        <ArrangerandeKlubbar />
        <Footer websiteID={websiteID}/>
      </>);
    }
    else if (page.includes('admin') || page.includes('login')) {
        let element = logedIn ? <Admin websiteID={websiteID} user={userOrNull}/> : <Login />;
        return (element);
    }
    else {
        return (<>
        <NavWrapper websiteID={websiteID}/>
        <Home websiteID={websiteID}/>
        <Footer websiteID={websiteID}/>
      </>);
    }
};
export default App;
