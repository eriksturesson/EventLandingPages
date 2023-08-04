import React, { Dispatch, MouseEventHandler, useRef, useState } from 'react';
import arrowDown from '../../assets/baseline_keyboard_arrow_down_white_18dp.png';
import { DBFullScreenMedia } from '../../interfaces/dbInterfaces';
import { SectionProps } from '../../interfaces/sectionInterfaces';
import {
   Box,
   Container,
   Divider,
   FormControl,
   MenuItem,
   Select,
   TextField,
   Button,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Stack,
   Slider,
} from '@mui/material';
import { ImageButtonFileUpload } from '../../smallComponents/FileUploads';
import { EditText, handleSaveTexts, handleStateTextChange } from '../../smallComponents/TextEdits';

interface Props {
   textFields: any;
   onEditing: Dispatch<boolean>;
   onSubmit: () => void;
}

function TextEditDialog(props: Props): JSX.Element {
   // const [isEditing, setEditing] = useState<boolean>(false);
   // const [mediaSize, setMediaSize] = useState<number>(50);

   const { textFields, onEditing, onSubmit } = props;

   const { title, description, time, location } = textFields;

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
                  initText={title.current}
                  onChange={(event: any) => {
                     title.current = event.target.value;
                  }}
                  labelName={'Title'}
               />
               <EditText
                  initText={description.current}
                  onChange={(event: any) => {
                     // setDescription(event.target.value);
                     description.current = event.target.value;
                  }}
                  labelName={'Description'}
               />
               <EditText
                  initText={time.current}
                  onChange={(event: any) => {
                     // setTime(event.target.value);
                     time.current = event.target.value;
                  }}
                  labelName={'Time'}
               />
               <EditText
                  initText={location.current}
                  onChange={(event: any) => {
                     // setLocation(event.target.value);
                     location.current = event.target.value;
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
            <Button onClick={onSubmit}>Save</Button>
         </DialogActions>
      </Dialog>
   );
}
export default TextEditDialog;
