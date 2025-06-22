import SaveIcon from '@mui/icons-material/Save';
import {
   Box,
   Button,
   FormControl,
   Grid,
   InputLabel,
   MenuItem,
   Select,
   SelectChangeEvent,
   TextField,
   Typography,
} from '@mui/material';
import { onValue, ref, update } from 'firebase/database';
import React, { ReactNode, useEffect, useState } from 'react';
import { useDbContent } from '../../contexts/DBContentContext';
import { DBHomePageContentButton } from '../../interfaces/dbInterfaces';
import { SectionProps } from '../../interfaces/sectionInterfaces';
import { db } from '../../utils/firebase';
import { readAndWriteToFirebase } from '../../utils/firebaseFunctions';

export let customColor: string = '';
export function RegisterButtonComponent({ buttonContent }: { buttonContent: DBHomePageContentButton }): JSX.Element {
   const formLink = buttonContent && buttonContent.formLink ? buttonContent.formLink : '';
   const buttonText = buttonContent && buttonContent.buttonText ? buttonContent.buttonText : 'Anmälan';
   const buttonInfo = buttonContent && buttonContent.buttonInfo ? buttonContent.buttonInfo : '';
   let buttonColor = buttonContent && buttonContent.buttonColor ? buttonContent.buttonColor : 'blue';
   if (buttonColor === 'green') buttonColor = 'success';
   else if (buttonColor === 'red') buttonColor = 'error';
   else if (buttonColor === 'blue') buttonColor = 'primary';
   else {
      console.error('Error: buttonColor is not supported. It is: ' + buttonColor);
   }
   return (
      <Box textAlign="center" sx={{ my: 2 }}>
         <Box className="callToActionButton" sx={{ mb: 2 }}>
            <Button color={buttonColor as any} href={formLink} variant="contained">
               {buttonText}
            </Button>
         </Box>
         <Typography>{buttonInfo}</Typography>
      </Box>
   );
}

async function saveButtonDataToDB(
   homepageButtonContent: DBHomePageContentButton,
   websiteID: string,
   sectionID: string,
   pageID: string | null
): Promise<string> {
   if (!homepageButtonContent.buttonColor) {
      homepageButtonContent.buttonColor = 'blue';
   }
   if (!homepageButtonContent.buttonText) {
      homepageButtonContent.buttonText = 'Anmälan';
   }
   const path = pageID ? `customPages/${pageID}/content/${sectionID}/content/` : `homepageContent/${sectionID}/content/`;
   await readAndWriteToFirebase({
      method: 'update',
      ref: `websites/${websiteID}/` + path,
      data: homepageButtonContent,
   });
   return `homepageContentButton saved to database`;
}

function handleButtonColorChange(
   event: SelectChangeEvent<string>,
   websiteID: ReactNode,
   sectionID: string,
   pageID: string | null
): void {
   const path = pageID ? `customPages/${pageID}/content/${sectionID}/content/` : `homepageContent/${sectionID}/content/`;
   update(ref(db, `websites/${websiteID}/` + path), {
      buttonColor: event.target.value,
   });
}

export function CallToActionButtonComponent(props: SectionProps): JSX.Element {
   const { data, adminEditor, pageID } = props;
   const { sectionName, sectionID, sectionOrder, createdAt, updatedAt } = data;
   const { websiteID } = useDbContent();
   const buttonContent = data.content as DBHomePageContentButton | undefined;
   const [homepageButtonContent, setHomepageButtonContent] = useState<DBHomePageContentButton>(
      buttonContent ? buttonContent : { formLink: '', buttonText: '', buttonInfo: '', buttonColor: '' }
   );
   if (adminEditor) {
      useEffect(() => {
         // READ DATA WHEN UPDATED TO UPDATE INDEX.HTML PROGRAM CONTENT
         const path = pageID
            ? `customPages/${pageID}/content/${sectionID}/content/`
            : `homepageContent/${sectionID}/content/`;
         let readButtonContentFromDatabase = ref(db, `websites/${websiteID}/` + path);
         onValue(readButtonContentFromDatabase, (snapshot) => {
            let buttonContentFromDB: DBHomePageContentButton = snapshot.val() ? snapshot.val() : '';
            setHomepageButtonContent(buttonContentFromDB);
         });
      }, []);

      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
         setHomepageButtonContent({
            ...homepageButtonContent,
            [event.target.name]: event.target.value,
         });
      };

      const handleSelectChange = (event: SelectChangeEvent<HTMLSelectElement>) => {
         setHomepageButtonContent({
            ...homepageButtonContent,
            [event.target.name]: event.target.value as string,
         });
      };

      return (
         <>
            <RegisterButtonComponent buttonContent={homepageButtonContent} />
            <Box sx={{ padding: 4, textAlign: 'center' }}>
               <Typography variant="h5">Edit register/call to action Button</Typography>
            </Box>
            <Box
               sx={{
                  display: 'inline-flex',
                  minWidth: '10rem',
                  flexDirection: 'row',
                  padding: '1rem',
               }}
               textAlign="center"
            >
               <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Button Color</InputLabel>
                  <Select
                     labelId="demo-simple-select-label"
                     variant="filled"
                     name="buttonColor"
                     id="demo-simple-select"
                     value={
                        homepageButtonContent && homepageButtonContent.buttonColor
                           ? (homepageButtonContent.buttonColor as any)
                           : 'blue'
                     }
                     label="Button Color"
                     onChange={handleSelectChange}
                  >
                     <MenuItem value={'red'}>Red</MenuItem>
                     <MenuItem value={'blue'}>Blue</MenuItem>
                     <MenuItem value={'green'}>Green</MenuItem>
                  </Select>
               </FormControl>
            </Box>
            <Grid
               component="form"
               container
               spacing={2}
               padding="1rem"
               textAlign="center"
               noValidate
               autoComplete="off"
               onSubmit={() => saveButtonDataToDB(homepageButtonContent, websiteID, sectionID, pageID)}
            >
               <Grid item xs={12} sm={6}>
                  <TextField
                     name="formLink"
                     id="formLinkField"
                     label="Link to form"
                     variant="filled"
                     InputLabelProps={{ shrink: true }}
                     fullWidth
                     value={homepageButtonContent.formLink}
                     onChange={handleChange}
                  />
               </Grid>
               <Grid item xs={12} sm={6}>
                  <TextField
                     name="buttonText"
                     id="buttonTextField"
                     label="Button text"
                     variant="filled"
                     InputLabelProps={{ shrink: true }}
                     fullWidth
                     value={homepageButtonContent.buttonText}
                     onChange={handleChange}
                  />
               </Grid>
               <Grid item xs={12}>
                  <TextField
                     name="buttonInfo"
                     id="buttonInfoField"
                     label="Button info"
                     variant="filled"
                     InputLabelProps={{ shrink: true }}
                     fullWidth
                     value={homepageButtonContent.buttonInfo}
                     onChange={handleChange}
                  />
               </Grid>
               <Grid item xs={12} display="flex" alignItems="center" justifyContent="center">
                  <Button type="submit" variant="contained" endIcon={<SaveIcon />}>
                     Save
                  </Button>
               </Grid>
            </Grid>
         </>
      );
   } else {
      return <RegisterButtonComponent buttonContent={homepageButtonContent} />;
   }
}
