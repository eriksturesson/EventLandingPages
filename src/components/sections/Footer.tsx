import { Box, Divider, Grid } from '@mui/material';
import { useState } from 'react';
import mapImageExample from '../../assets/mapImageExample.png';
import kartbild from '../../assets/Rotary Karta till Stockholm City Affärsnätverk.png'; // relative path to image
import { DBHomePageContentFooter } from '../interfaces/dbInterfaces';
import { SectionProps } from '../interfaces/sectionInterfaces';
import { ImageButtonFileUpload } from '../smallComponents/FileUploads';
import { EditText, SaveTextsButton } from '../smallComponents/TextEdits';

export function Footer(props: SectionProps): JSX.Element {
   const { data, adminEditor } = props;
   const content = data.content as DBHomePageContentFooter | undefined;
   const { sectionID } = data;
   const [adressTitle, setAdressTitle] = useState(content?.adressTitle ? content.adressTitle : '');
   const [contactTitle, setContactTitle] = useState(content?.contactTitle ? content.contactTitle : '');
   const [contactName, setContactName] = useState(content?.contactName ? content.contactName : '');
   const [contactPhone, setContactPhone] = useState(content?.contactPhone ? content.contactPhone : '');
   const [contactEmail, setContactEmail] = useState(content?.contactEmail ? content.contactEmail : '');
   const [contactAddress1, setContactAddress1] = useState(content?.contactAddress1 ? content.contactAddress1 : '');
   const [contactAddress2, setContactAddress2] = useState(content?.contactAddress2 ? content.contactAddress2 : '');
   const [mapImage, setMapImage] = useState(content?.mapImage ? content.mapImage : '');
   const [integrityPolicy, setIntegrityPolicy] = useState(content?.integrityPolicy ? content.integrityPolicy : '');
   const [integrityPolicyDescription, setIntegrityPolicyDescription] = useState(
      content?.integrityPolicyDescription ? content.integrityPolicyDescription : ''
   );

   if (content) {
      return (
         <>
            {adminEditor ? (
               <Divider>
                  <h2>Edit Footer</h2>
               </Divider>
            ) : null}

            <Grid container>
               <Grid item xs={12} md={6} padding={2}>
                  {adminEditor ? (
                     <EditText
                        onChange={(event: any) => setAdressTitle(event.target.value)}
                        value={adressTitle}
                        type="header"
                        labelName="Adress Title"
                     />
                  ) : (
                     <h2>{content?.adressTitle}</h2>
                  )}
                  {adminEditor ? (
                     <EditText
                        onChange={(event: any) => setContactAddress1(event.target.value)}
                        value={contactAddress1}
                        type="description"
                        labelName="Contact Address 1"
                     />
                  ) : (
                     <p>{content?.contactAddress1}</p>
                  )}
                  {adminEditor ? (
                     <EditText
                        onChange={(event: any) => setContactAddress2(event.target.value)}
                        value={contactAddress2}
                        type="description"
                        labelName="Contact Address 2"
                     />
                  ) : (
                     <p>{content?.contactAddress2}</p>
                  )}
                  {adminEditor ? (
                     <EditText
                        onChange={(event: any) => setContactTitle(event.target.value)}
                        value={contactTitle}
                        type="header"
                        labelName="Contact Title"
                     />
                  ) : (
                     <h2>{content?.contactTitle}</h2>
                  )}
                  {adminEditor ? (
                     <EditText
                        onChange={(event: any) => setContactName(event.target.value)}
                        value={contactName}
                        type="description"
                        labelName="Contact Name"
                     />
                  ) : (
                     <p>{content?.contactName}</p>
                  )}
                  {adminEditor ? (
                     <EditText
                        onChange={(event: any) => setContactPhone(event.target.value)}
                        value={contactPhone}
                        type="description"
                        labelName="Contact Phone"
                     />
                  ) : (
                     <p>{content?.contactPhone}</p>
                  )}
                  {adminEditor ? (
                     <EditText
                        onChange={(event: any) => setContactEmail(event.target.value)}
                        value={contactEmail}
                        type="description"
                        labelName="Contact Email"
                     />
                  ) : (
                     <p>{content?.contactEmail}</p>
                  )}
                  {adminEditor ? (
                     <EditText
                        onChange={(event: any) => setIntegrityPolicy(event.target.value)}
                        value={integrityPolicy}
                        type="description"
                        labelName="Link to Integrity Policy"
                     />
                  ) : null}
                  {adminEditor ? (
                     <EditText
                        onChange={(event: any) => setIntegrityPolicyDescription(event.target.value)}
                        value={integrityPolicyDescription}
                        type="description"
                        labelName="Integrity Policy Description"
                     />
                  ) : null}
                  {adminEditor ? (
                     <Grid item xs={12}>
                        <SaveTextsButton
                           refBelowWebsiteID={`homepageContent/${sectionID}/content/`}
                           data={{
                              adressTitle: adressTitle,
                              contactTitle: contactTitle,
                              contactName: contactName,
                              contactPhone: contactPhone,
                              contactEmail: contactEmail,
                              contactAddress1: contactAddress1,
                              contactAddress2: contactAddress2,
                              integrityPolicy: integrityPolicy,
                              integrityPolicyDescription: integrityPolicyDescription,
                           }}
                        />
                     </Grid>
                  ) : null}
               </Grid>
               <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                     alignContent: 'center',
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                     position: 'relative',
                  }}
               >
                  {/* {adminEditor ? <NewImgBoxFileUpload sectionID={sectionID} order={0} sectionName={'footer'} /> : null} */}
                  <img id="kartbild" alt="karta" src={content.mapImage ? content.mapImage : mapImageExample} />
                  {adminEditor ? (
                     <Box
                        sx={{
                           alignContent: 'center',
                           alignItems: 'center',
                           position: 'absolute',
                           top: '50%',
                           left: '50%',
                           transform: 'translate(-50%, -50%)',
                        }}
                     >
                        <ImageButtonFileUpload order={1} sectionID={sectionID} sectionName={'footer'} />
                     </Box>
                  ) : null}
               </Grid>

               <Grid item xs={12} id="footer">
                  <Box>
                     <a href={integrityPolicy}>{integrityPolicyDescription}</a>
                  </Box>
               </Grid>
            </Grid>
         </>
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
