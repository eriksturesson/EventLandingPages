import React from 'react';
import kartbild from "../assets/Rotary Karta till Stockholm City Affärsnätverk.png" // relative path to image


const Footer = ({ websiteID }: { websiteID: string }): JSX.Element => {
    return (

        <div>
            <div id="endwrapper">
                <div id="kontaktinfo">
                    <h2>Plats</h2>
                    <p>Västra Trädgårdsgatan 11A</p>
                    <p>111 53 Stockholm</p>
                    <h2>Kontakt</h2>
                    <p>E-post: hej@stockholmcityaffarsnatverk.se</p>
                </div>
                <div id="karta">
                    <img id="kartbild" alt="karta" src={kartbild} />
                </div>
            </div>


            <div id="footer">
                <a href="https://firebasestorage.googleapis.com/v0/b/stockholm-city-affarsnatverk.appspot.com/o/Integritetspolicy%201.0%20-%20Stockholm%20City%20Aff%C3%A4rsn%C3%A4tverk.pdf?alt=media&token=44075bd0-fc76-44a1-a4c0-f634a1a5b45c">Vår integritetspolicy</a>
            </div>
        </div>
    );
}

export default Footer;