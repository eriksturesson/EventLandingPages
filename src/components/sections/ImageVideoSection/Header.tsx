import React, { MouseEventHandler, useRef, useState } from 'react';
import arrowDown from '../../../assets/baseline_keyboard_arrow_down_white_18dp.png';
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
import TextEditDialog from './TextEditDialog';

export function HeaderComponent(props: SectionProps): JSX.Element {
   const { adminEditor, data } = props;
   const { sectionID, content } = data;
   const {
      video,
      image,
      mediaSize: initMediaSize,
      title: initTitle,
      description: initDesc,
      time: initTime,
      location: initLocation,
   } = content as DBFullScreenMedia;
   const [isEditing, setEditing] = useState<boolean>(false);
   const [mediaSize, setMediaSize] = useState<number>(initMediaSize);

   const title = useRef(initTitle);
   const description = useRef(initDesc);
   const time = useRef(initTime);
   const location = useRef(initLocation);

   // const videoOrImage = video ? video : image ? image : null;
   let videoOrImage = video; // used for testing only

   const textEditHandler = function () {
      const data = {
         title: title.current,
         description: description.current,
         time: time.current,
         location: location.current,
      };
      handleSaveTexts({ refBelowWebsiteID: `homepageContent/${sectionID}/content/`, data });

      setEditing(false);
   };

   let headerContent: JSX.Element = <></>;
   if (videoOrImage === video && video !== null) {
      headerContent = (
         <video autoPlay muted loop className="video-container" style={{ width: '100%' }}>
            <source src={video} type={`video/mp4`} />
            Your browser does not support the video tag.
         </video>
      );
   } else if (videoOrImage === image && image !== null) {
      headerContent = (
         <img
            /* className="top-image" */ src={image}
            alt="headerImage"
            style={{ width: '100%' /* removing styles from '.adminEdit img': */, filter: 'none', opacity: 1 }}
         ></img>
      );
   }

   return (
      <Stack
         component="section"
         alignItems="center"
         justifyContent="space-between"
         sx={adminEditor ? { minHeight: '100vh', maxHeight: '100vh' } : {}}
      >
         {adminEditor && (
            <Divider>
               <h2>Edit img/video</h2>
            </Divider>
         )}
         <Box className="header-container" sx={{ width: `${mediaSize}vw`, height: 'auto' }}>
            {headerContent}
            {isEditing && null}

            <div className="box-text-over-video black-layer" style={{ width: '100%' }}>
               <h1 className="text-over-video">{title.current}</h1>
               <h3 className="text-over-video">{description.current}</h3>
               <h2 className="text-over-video">
                  {time.current} {'•'} {location.current}
               </h2>
               <p>
                  <img className="move-arrow" src={arrowDown}></img>
               </p>
               {isEditing && (
                  <TextEditDialog
                     textFields={{ title, description, time, location }}
                     onEditing={setEditing}
                     onSubmit={textEditHandler}
                  />
               )}
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
               <Button
                  onClick={() => {
                     setEditing(true);
                  }}
               >
                  Edit text
               </Button>
               <Stack spacing={2} direction="row">
                  <ImageButtonFileUpload cardOrderNr={1} sectionID={sectionID} sectionName={'fullScreenMedia'} />
                  <Slider
                     aria-label="Always visible"
                     defaultValue={mediaSize}
                     sx={{ width: '8em' }}
                     valueLabelDisplay="auto"
                     disabled={false}
                     min={10}
                     onChange={(event: any) => {
                        setMediaSize(event.target.value);
                     }}
                  />
               </Stack>
            </Stack>
         )}
      </Stack>
   );
}
