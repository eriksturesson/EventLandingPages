import React, { Dispatch } from 'react';
import { FormControl, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { EditText } from '../../smallComponents/TextEdits';

interface Props {
   textFields: any;
   onEditing: Dispatch<boolean>;
   onSubmit: (data: any) => void;
}

function TextEditDialog(props: Props): JSX.Element {
   const { textFields, onEditing, onSubmit } = props;

   const { title, description, time, location } = textFields;

   const tempTextContent = {
      ...textFields,
   };

   const handleTextSave = () => {
      onSubmit(tempTextContent);
   };

   return (
      <Dialog fullWidth open={true}>
         <DialogTitle>Change text fields</DialogTitle>
         <DialogContent>
            <FormControl
               sx={{
                  display: 'flex',
                  flexDirection: 'column',
               }}
            >
               <EditText
                  initText={title}
                  onChange={(event: any) => {
                     tempTextContent.title = event.target.value;
                  }}
                  labelName={'Title'}
               />
               <EditText
                  initText={description}
                  onChange={(event: any) => {
                     // setDescription(event.target.value);
                     tempTextContent.description = event.target.value;
                  }}
                  labelName={'Description'}
               />
               <EditText
                  initText={time}
                  onChange={(event: any) => {
                     // setTime(event.target.value);
                     tempTextContent.time = event.target.value;
                  }}
                  labelName={'Time'}
               />
               <EditText
                  initText={location}
                  onChange={(event: any) => {
                     // setLocation(event.target.value);
                     tempTextContent.location = event.target.value;
                  }}
                  labelName={'Location'}
               />
            </FormControl>
         </DialogContent>
         <DialogActions>
            <Button
               onClick={() => {
                  onEditing(false);
               }}
            >
               Cancel
            </Button>
            <Button onClick={handleTextSave}>Save</Button>
         </DialogActions>
      </Dialog>
   );
}
export default TextEditDialog;
