import { Box, Grid } from '@mui/material';
import { useState } from 'react';
import mapImageExample from '../../assets/mapImageExample.png';
import { DBHomePageContentFooter } from '../../interfaces/dbInterfaces';
import { SectionProps } from '../../interfaces/sectionInterfaces';
import { ImageButtonFileUpload } from '../smallComponents/FileUploads';
import { EditText, SaveTextsButton } from '../smallComponents/TextEdits';

export function FooterComponent(props: SectionProps): JSX.Element {
   const { data, adminEditor, pageID } = props;
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

   if (!adminEditor) {
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
                  <img id="kartbild" alt="karta" src={mapImage ? mapImage : mapImageExample} />
               </div>
            </div>

            <div id="footerPolicy">
               <a href={content?.integrityPolicy}>{content?.integrityPolicyDescription}</a>
            </div>
         </div>
      );
   } else {
      return (
         <>
            <Grid container>
               <Grid item xs={12} md={6}>
                  <EditText
                     onChange={(event: any) => setAdressTitle(event.target.value)}
                     value={adressTitle}
                     type="header"
                     labelName="Adress Title"
                     style={{ marginTop: '1rem' }}
                  />

                  <EditText
                     onChange={(event: any) => setContactAddress1(event.target.value)}
                     value={contactAddress1}
                     type="description"
                     labelName="Contact Address 1"
                     style={{ marginTop: '1rem' }}
                  />

                  <EditText
                     onChange={(event: any) => setContactAddress2(event.target.value)}
                     value={contactAddress2}
                     type="description"
                     labelName="Contact Address 2"
                     style={{ marginTop: '1rem' }}
                  />

                  <EditText
                     onChange={(event: any) => setContactTitle(event.target.value)}
                     value={contactTitle}
                     type="header"
                     labelName="Contact Title"
                     style={{ marginTop: '1rem' }}
                  />

                  <EditText
                     onChange={(event: any) => setContactName(event.target.value)}
                     value={contactName}
                     type="description"
                     labelName="Contact Name"
                     style={{ marginTop: '1rem' }}
                  />

                  <EditText
                     onChange={(event: any) => setContactPhone(event.target.value)}
                     value={contactPhone}
                     type="description"
                     labelName="Contact Phone"
                     style={{ marginTop: '1rem' }}
                  />

                  <EditText
                     onChange={(event: any) => setContactEmail(event.target.value)}
                     value={contactEmail}
                     type="description"
                     labelName="Contact Email"
                     style={{ marginTop: '1rem' }}
                  />

                  <EditText
                     onChange={(event: any) => setIntegrityPolicy(event.target.value)}
                     value={integrityPolicy}
                     type="description"
                     labelName="Link to Integrity Policy"
                     style={{ marginTop: '1rem' }}
                  />

                  <EditText
                     onChange={(event: any) => setIntegrityPolicyDescription(event.target.value)}
                     value={integrityPolicyDescription}
                     type="description"
                     labelName="Integrity Policy Description"
                     style={{ marginTop: '1rem' }}
                  />

                  <Grid item xs={12}>
                     <SaveTextsButton
                        refBelowWebsiteID={
                           pageID
                              ? `customPages/${pageID}/conent/${sectionID}/content/`
                              : `homepageContent/${sectionID}/content/`
                        }
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
                  <img id="kartbild" alt="karta" src={content?.mapImage ? content.mapImage : mapImageExample} />
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
                     <ImageButtonFileUpload
                        order={1}
                        sectionID={sectionID}
                        sectionName={'footer'}
                        id={'mapImage'}
                        pageID={pageID}
                     />
                  </Box>
               </Grid>

               <Grid item xs={12} id="footer">
                  <Box>
                     <a href={integrityPolicy}>{integrityPolicyDescription}</a>
                  </Box>
               </Grid>
            </Grid>
         </>
      );
   }
}
