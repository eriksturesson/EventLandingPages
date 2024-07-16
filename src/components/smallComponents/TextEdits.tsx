import { Box, Button, TextField } from '@mui/material';
import { ref as dbRef, update } from 'firebase/database';
import { WEBSITE_ID } from '../../App';
import { db } from '../utils/firebase';

export const handleSaveTexts = ({ refBelowWebsiteID, data }: { refBelowWebsiteID: string; data: object }) => {
   // Perform your save logic here, e.g., make an API call to save the data
   console.log('Saving texts to db');
   update(dbRef(db, `websites/${WEBSITE_ID}/${refBelowWebsiteID}`), data);
   console.log('Saved title and description');
};

export function EditText({
   initText,
   onChange,
   type,
   labelName,
   rows,
}: {
   initText?: string;
   onChange: any;
   labelName?: string;
   type?: 'header' | 'description';
   rows?: number;
}): JSX.Element {
   return (
      <Box style={{ paddingBottom: '2rem', width: '100%', alignContent: 'center' }}>
         <TextField
            id="outlined-textarea"
            label={labelName ? labelName : type ? type : 'Header'}
            placeholder="Placeholder"
            rows={rows ? rows : 1}
            multiline
            defaultValue={initText ? initText : ''}
            style={{ width: '100%', alignContent: 'center' }}
            InputLabelProps={{ shrink: true }}
            onChange={onChange}
         />
      </Box>
   );
}

export function SaveTextsButton({ refBelowWebsiteID, data }: { refBelowWebsiteID: string; data: object }): JSX.Element {
   return (
      <Box style={{ paddingBottom: '2rem', textAlign: 'center', width: '100%' }}>
         <Button onClick={() => handleSaveTexts({ refBelowWebsiteID, data })} variant="contained" color="primary">
            Save texts
         </Button>
      </Box>
   );
}

export function handleStateTextChange(setStateFunction: (word: string) => void, event: any) {
   let text: string = event.target.value;
   setStateFunction(text);
}
