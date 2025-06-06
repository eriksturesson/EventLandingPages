import SaveIcon from '@mui/icons-material/Save';
import {
   Box,
   Button,
   Divider,
   FormControl,
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
import { DBHomePageContentButton } from '../interfaces/dbInterfaces';
import { SectionProps } from '../interfaces/sectionInterfaces';
import { db } from '../utils/firebase';
import { readAndWriteToFirebase } from '../utils/firebaseFunctions';

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
         <Box className="rotaryknapp">
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
   sectionID: string
): Promise<string> {
   if (!homepageButtonContent.buttonColor) {
      homepageButtonContent.buttonColor = 'blue';
   }
   if (!homepageButtonContent.buttonText) {
      homepageButtonContent.buttonText = 'Anmälan';
   }
   await readAndWriteToFirebase({
      method: 'update',
      ref: `websites/${websiteID}/homepageContent/${sectionID}/content/`,
      data: homepageButtonContent,
   });
   return `homePageContentButton saved to database`;
}

function handleButtonColorChange(event: SelectChangeEvent<string>, websiteID: ReactNode, sectionID: string): void {
   update(ref(db, `websites/${websiteID}/homepageContent/${sectionID}/content/`), {
      buttonColor: event.target.value,
   });
}

export function CallToActionButtonComponent(props: SectionProps): JSX.Element {
   const { data, adminEditor } = props;
   const { sectionName, sectionID, sectionOrder, createdAt, updatedAt } = data;
   const { websiteID } = useDbContent();
   const buttonContent = data.content as DBHomePageContentButton | undefined;
   const [homepageButtonContent, setHomepageButtonContent] = useState<DBHomePageContentButton>(
      buttonContent ? buttonContent : { formLink: '', buttonText: '', buttonInfo: '', buttonColor: '' }
   );
   if (adminEditor) {
      useEffect(() => {
         // READ DATA WHEN UPDATED TO UPDATE INDEX.HTML PROGRAM CONTENT
         let readButtonContentFromDatabase = ref(db, `websites/${websiteID}/homepageContent/${sectionID}/content/`);
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
            <Divider>
               <Typography variant="h6">Edit button</Typography>
            </Divider>
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
            <Box
               sx={{
                  display: 'inline-flex',
                  flexDirection: 'row',
                  padding: '1rem',
               }}
               component="form"
               textAlign="center"
               noValidate
               autoComplete="off"
               //onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleButtonChange(e, websiteID)}
               onSubmit={() => saveButtonDataToDB(homepageButtonContent, websiteID, sectionID)}
            >
               <TextField
                  name="formLink"
                  id="formLinkField"
                  label="Link to form"
                  sx={{ padding: '1rem' }}
                  variant="filled"
                  InputLabelProps={{ shrink: true }}
                  value={homepageButtonContent.formLink}
                  //onChange={(e) => setFormLink(e.target.value)}
                  onChange={handleChange}
                  /*
                onChange={(e) => setHomepageButtonContent({
                    ...homepageButtonContent,
                    formLink: e.target.value
                })
                }
                */
               />
               <TextField
                  name="buttonText"
                  id="buttonTextField"
                  label="Button text"
                  sx={{ padding: '1rem' }}
                  variant="filled"
                  InputLabelProps={{ shrink: true }}
                  value={homepageButtonContent.buttonText}
                  //onChange={(e) => setButtonText(e.target.value)}
                  onChange={handleChange}
                  /*
                onChange={(e) => setHomepageButtonContent({
                    ...homepageButtonContent,
                    buttonText: e.target.value
                })
                }
                */
               />

               <TextField
                  name="buttonInfo"
                  id="buttonInfoField"
                  sx={{ padding: '1rem' }}
                  label="Button info"
                  variant="filled"
                  InputLabelProps={{ shrink: true }}
                  value={homepageButtonContent.buttonInfo}
                  //onChange={(e) => setButtonInfo(e.target.value)}
                  onChange={handleChange}
                  /*
                onChange={(e) => setHomepageButtonContent({
                    ...homepageButtonContent,
                    buttonInfo: e.target.value
                })
                }
                */
               />
               <Button type="submit" variant="contained" endIcon={<SaveIcon />}>
                  Save
               </Button>
            </Box>
         </>
      );
   } else {
      return (
         <>
            <RegisterButtonComponent buttonContent={homepageButtonContent} />
         </>
      );
   }
}

function REACT_EXAMPLEControlledComponent() {
   const [inputValue, setInputValue] = useState('');

   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
   };

   return (
      <form>
         <label>
            Input Value:
            <input type="text" value={inputValue} onChange={handleChange} />
         </label>
         <p>Input Value: {inputValue}</p>
      </form>
   );
}
