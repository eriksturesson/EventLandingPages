import { Box, Button } from '@mui/material';
import { handleSaveTexts } from './TextEdits';

export function SaveTextsButton({ refBelowWebsiteID, data }: { refBelowWebsiteID: string; data: object }): JSX.Element {
   return (
      <Box style={{ marginTop: '2rem', paddingBottom: '2rem', textAlign: 'center', width: '100%' }}>
         <Button onClick={() => handleSaveTexts({ refBelowWebsiteID, data })} variant="contained" color="primary">
            Save texts
         </Button>
      </Box>
   );
}
