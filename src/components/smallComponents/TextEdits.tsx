import { Box, Button, TextField } from '@mui/material';

export function EditText({ initText, onChange, rows }: { initText: string; onChange: any; rows?: number }): JSX.Element {
   return (
      <Box style={{ paddingBottom: '2rem', width: '100%' }}>
         <TextField
            id="outlined-textarea"
            label="Header"
            placeholder="Placeholder"
            rows={rows ? rows : 1}
            multiline
            defaultValue={initText}
            style={{ width: '100%' }}
            InputLabelProps={{ shrink: true }}
            onChange={onChange}
         />
      </Box>
   );
}

export function SaveTextsButton({ onSave }: { onSave: any }): JSX.Element {
   return (
      <Box style={{ paddingBottom: '2rem', textAlign: 'center', width: '100%' }}>
         <Button onClick={onSave} variant="contained" color="primary">
            Save texts
         </Button>
      </Box>
   );
}
