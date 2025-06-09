import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl } from '@mui/material';
import { Dispatch, useState } from 'react';
import { EditText } from './TextEdits';

export interface FullScreenMediaTextFields {
   title?: string;
   description?: string;
   time?: string;
   location?: string;
}

interface Props {
   textFields: FullScreenMediaTextFields;
   onEditing: Dispatch<boolean>;
   onSubmit: (data: FullScreenMediaTextFields) => void;
}

export default function TextEditDialog({ textFields, onEditing, onSubmit }: Props): JSX.Element {
   const [values, setValues] = useState<FullScreenMediaTextFields>(textFields);

   const handleChange = (field: keyof FullScreenMediaTextFields) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({
         ...prev,
         [field]: event.target.value,
      }));
   };

   const handleSave = () => {
      onSubmit(values);
      onEditing(false);
   };

   return (
      <Dialog fullWidth open onClose={() => onEditing(false)}>
         <DialogTitle>Edit Text Fields</DialogTitle>
         <DialogContent>
            <FormControl
               sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  mt: 1,
               }}
            >
               <EditText labelName="Title" value={values.title || ''} onChange={handleChange('title')} />
               <EditText labelName="Description" value={values.description || ''} onChange={handleChange('description')} />
               <EditText labelName="Time" value={values.time || ''} onChange={handleChange('time')} />
               <EditText labelName="Location" value={values.location || ''} onChange={handleChange('location')} />
            </FormControl>
         </DialogContent>
         <DialogActions>
            <Button onClick={() => onEditing(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
               Save
            </Button>
         </DialogActions>
      </Dialog>
   );
}
