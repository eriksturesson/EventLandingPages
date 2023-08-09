import React, { MouseEventHandler, useRef, useState } from 'react';
import arrowDown from '../../../assets/baseline_keyboard_arrow_down_white_18dp.png';
import { DBFullScreenMedia } from '../../interfaces/dbInterfaces';
import { SectionProps } from '../../interfaces/sectionInterfaces';
import { Box, Divider, Button, Stack, Slider } from '@mui/material';
import { ImageButtonFileUpload } from '../../smallComponents/FileUploads';
import { handleSaveTexts, SaveTextsButton } from '../../smallComponents/TextEdits';
import TextEditDialog from './TextEditDialog';

export function HeaderComponent(props: SectionProps): JSX.Element {
   const { adminEditor, data } = props;
   const { sectionID, content } = data;
   const { video, image, mediaSize: initMediaSize, title, description, time, location } = content as DBFullScreenMedia;
   const [isEditing, setEditing] = useState<boolean>(false);
   const [mediaSize, setMediaSize] = useState<number>(initMediaSize);
   const [textFields, setTextFields] = useState({ title, description, time, location });
   const refBelowWebsiteID = `homepageContent/${sectionID}/content/`;

   const videoOrImage = video ? video : image ? image : null;
   // let videoOrImage = image; // used for testing only

   const textEditHandler = function (data: any) {
      console.log(data);
      handleSaveTexts({ refBelowWebsiteID, data });

      setEditing(false);

      setTextFields(data);
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
               <h1 className="text-over-video">{textFields.title}</h1>
               <h3 className="text-over-video">{textFields.description}</h3>
               <h2 className="text-over-video">
                  {textFields.time} {'•'} {textFields.location}
               </h2>
               <p>
                  <img className="move-arrow" src={arrowDown}></img>
               </p>
               {isEditing && <TextEditDialog textFields={textFields} onEditing={setEditing} onSubmit={textEditHandler} />}
            </div>
         </Box>
         {adminEditor && (
            <Stack
               spacing={4}
               direction="row"
               justifyContent="center"
               sx={{
                  width: '100%',
                  height: '4em',
                  backgroundColor: 'lightblue',
                  padding: '1em',
                  borderBottom: '2px solid blue',
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
                     value={mediaSize}
                     sx={{ width: '8em', flexShrink: 0 }}
                     valueLabelDisplay="auto"
                     disabled={false}
                     min={10}
                     onChange={(event: any) => {
                        setMediaSize(event.target.value);
                     }}
                  />
                  <SaveTextsButton refBelowWebsiteID={refBelowWebsiteID} data={{ mediaSize }} />
               </Stack>
            </Stack>
         )}
      </Stack>
   );
}
