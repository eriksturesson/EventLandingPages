import React, { MouseEventHandler, useRef, useState } from 'react';
import arrowDown from '../../assets/baseline_keyboard_arrow_down_white_18dp.png';
import { DBFullScreenMedia } from '../interfaces/dbInterfaces';
import { SectionProps } from '../interfaces/sectionInterfaces';
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
} from '@mui/material';
import { ImageButtonFileUpload } from '../smallComponents/FileUploads';
import { EditText, handleSaveTexts, handleStateTextChange } from '../smallComponents/TextEdits';

export function HeaderComponent(props: SectionProps): JSX.Element {
   const [isEditing, setEditing] = useState<boolean>(false);
   const { adminEditor, data } = props;
   const { sectionID, content } = data;
   const { video, image, title, description, time, location } = content as DBFullScreenMedia;

   const videoOrImage = video ? video : image ? image : null;
   // let videoOrImage = null;

   let headerContent: JSX.Element = <></>;
   if (videoOrImage === video && video !== null) {
      headerContent = (
         <>
            <video autoPlay muted loop className="video-container">
               <source src={video} type={`video/mp4`} />
               Your browser does not support the video tag.
            </video>
         </>
      );
   } else if (videoOrImage === image && image !== null) {
      headerContent = <img className="top-image" src={image} alt="headerImage"></img>;
   }

   const textEditHandler = function (event: any) {
      if (isEditing) {
         console.info('Not savning anything at the moment....');
         // handleSaveTexts({ refBelowWebsiteID: `homepageContent/${sectionID}/content/`, data: event.target.value });
         console.info(event);
      }
      setEditing(!isEditing);
   };

   return (
      <Box component="section">
         {adminEditor && (
            <Divider>
               <h2>Edit img/video</h2>
            </Divider>
         )}
         <Box className="header-container black-layer">
            {headerContent}
            {isEditing && null}

            <div className="box-text-over-video">
               <h1 className="text-over-video">{title}</h1>
               <h3 className="text-over-video">{description}</h3>
               <h2 className="text-over-video">
                  {time} {'•'} {location}
               </h2>
               <p>
                  <img className="move-arrow" src={arrowDown}></img>
               </p>

               <Dialog fullWidth open={isEditing}>
                  <DialogTitle>Change text fields</DialogTitle>
                  <DialogContent>
                     <FormControl
                        sx={{
                           display: 'flex',
                           flexDirection: 'column',
                        }}
                        onSubmit={textEditHandler}
                     >
                        {[title, description, time, location].map((item, i) => (
                           <TextField value={item} sx={{ marginBottom: '1em' }} key={i} />
                        ))}
                     </FormControl>
                  </DialogContent>
                  <DialogActions>
                     <Button
                        onClick={() => {
                           setEditing(false);
                        }}
                     >
                        Cancel
                     </Button>
                     <Button type="submit">Save</Button>
                  </DialogActions>
               </Dialog>
            </div>
         </Box>
         {adminEditor && (
            <Stack
               spacing={4}
               direction="row"
               justifyContent="center"
               sx={{
                  width: '100%',
                  marginTop: '1em',
               }}
            >
               <Button onClick={textEditHandler}>Edit text</Button>
               <FormControl sx={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Select sx={{ width: '8em' }}>
                     <MenuItem disabled value="">
                        <em>Image size</em>
                     </MenuItem>
                     <MenuItem value={25}>25%</MenuItem>
                     <MenuItem value={50}>50%</MenuItem>
                     <MenuItem value={75}>75%</MenuItem>
                     <MenuItem value={100}>100%</MenuItem>
                     <MenuItem value={'full'}>Fullpage</MenuItem>
                  </Select>
                  <ImageButtonFileUpload cardOrderNr={1} sectionID={sectionID} sectionName={'fullScreenMedia'} />
               </FormControl>
            </Stack>
         )}
      </Box>
   );
}
