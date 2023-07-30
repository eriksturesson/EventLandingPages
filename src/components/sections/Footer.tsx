import React from 'react';
import kartbild from '../../assets/Rotary Karta till Stockholm City Affärsnätverk.png'; // relative path to image
import { DBHomePageContentFooter } from '../interfaces/dbInterfaces';
import { SectionProps } from '../interfaces/sectionInterfaces';

export function Footer(props: SectionProps): JSX.Element {
   const content = props.data.content as DBHomePageContentFooter;
   if (content) {
      return (
         <div>
            <div id="endwrapper">
               <div id="kontaktinfo">
                  <h2>{content?.adressTitle}</h2>
                  <p>{content?.contactAddress1}</p>
                  <p>{content?.contactAddress2}</p>
                  <h2>{content?.contactTitle}</h2>
                  <p>{content?.contactName}</p>
                  <p>{content?.contactPhone}</p>
                  <p>{content?.contactEmail}</p>
               </div>
               <div id="karta">
                  <img id="kartbild" alt="karta" src={content.mapImage} />
               </div>
            </div>

            <div id="footer">
               <a href={content?.integrityPolicy}>{content?.integrityPolicyDescription}</a>
            </div>
         </div>
      );
   } else {
      //Hardcoded
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
               <a href="https://firebasestorage.googleapis.com/v0/b/stockholm-city-affarsnatverk.appspot.com/o/Integritetspolicy%201.0%20-%20Stockholm%20City%20Aff%C3%A4rsn%C3%A4tverk.pdf?alt=media&token=44075bd0-fc76-44a1-a4c0-f634a1a5b45c">
                  Vår integritetspolicy
               </a>
            </div>
         </div>
      );
   }
}
