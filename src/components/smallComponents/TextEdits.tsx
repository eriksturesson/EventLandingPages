import { Box, Button, TextField } from '@mui/material';
import { ref as dbRef, update } from 'firebase/database';
import { useDbContent } from '../../contexts/DBContentContext';
import { db } from '../../utils/firebase';

export const handleSaveTexts = ({
   refBelowWebsiteID,
   data,
   websiteID,
}: {
   refBelowWebsiteID: string;
   data: object;
   websiteID: string;
}) => {
   // Perform your save logic here, e.g., make an API call to save the data
   console.log('Saving texts to db');

   update(dbRef(db, `websites/${websiteID}/${refBelowWebsiteID}`), data);
   console.log('Saved title and description');
};

export function EditText({
   onChange,
   type,
   value,
   labelName,
   rows,
}: {
   onChange: any;
   value: string;
   labelName?: string;
   type?: 'header' | 'description';
   rows?: number;
}): JSX.Element {
   return (
      <Box style={{ padding: '2rem', width: '100%', alignContent: 'center' }}>
         <TextField
            id="outlined-textarea"
            label={labelName ? labelName : type ? type : 'Header'}
            placeholder="Placeholder"
            rows={rows ? rows : 1}
            multiline
            value={value}
            style={{ width: '80%', alignContent: 'center' }}
            InputLabelProps={{ shrink: true }}
            onChange={onChange}
         />
      </Box>
   );
}

export function SaveTextsButton({ refBelowWebsiteID, data }: { refBelowWebsiteID: string; data: object }): JSX.Element {
   const { websiteID } = useDbContent();
   return (
      <Box style={{ marginTop: '2rem', paddingBottom: '2rem', textAlign: 'center', width: '100%' }}>
         <Button onClick={() => handleSaveTexts({ refBelowWebsiteID, data, websiteID })} variant="contained" color="primary">
            Save texts
         </Button>
      </Box>
   );
}

export function handleStateTextChange(setStateFunction: (word: string) => void, event: any) {
   let text: string = event.target.value;
   setStateFunction(text);
}
