import { Button, Divider, Slider, Stack } from '@mui/material';
import { useState } from 'react';
import arrowDown from '../../assets/baseline_keyboard_arrow_down_white_18dp.png';
import { DBFullScreenMedia } from '../interfaces/dbInterfaces';
import { SectionProps } from '../interfaces/sectionInterfaces';
import { ImageButtonFileUpload } from '../smallComponents/FileUploads';
import TextEditDialog from '../smallComponents/TextEditDialog';
import { handleSaveTexts, SaveTextsButton } from '../smallComponents/TextEdits';

export function FullScreenMedia(props: SectionProps): JSX.Element {
   const { adminEditor, data } = props;
   const sectionID = data.sectionID;
   const content = data.content ? data.content : null;
   let media, mediaType, initMediaSize, title, description, time, location;

   if (content) {
      ({ media, mediaType, mediaSize: initMediaSize, title, description, time, location} = content as DBFullScreenMedia);
   } else {
      // Provide default values or take any other necessary action when content is null
      // Example:
      media = null;
      mediaType = null;
      initMediaSize = 0;
      title = 'Default Title';
      description = 'Default Description';
      time = null;
      location = null;
   }
   const [isEditing, setEditing] = useState<boolean>(false);
   const [mediaSize, setMediaSize] = useState<number>(initMediaSize);
   const [textFields, setTextFields] = useState({ title, description, time, location });
   const refBelowWebsiteID = `homepageContent/${sectionID}/content/`;

   const videoOrImage: 'video' | 'image' | null = mediaType ? mediaType : null;
   // let videoOrImage = image; // used for testing only

   const textEditHandler = function (data: any) {
      console.log(data);
      handleSaveTexts({ refBelowWebsiteID, data });

      setEditing(false);

      setTextFields(data);
   };

   let headerContent: JSX.Element = <></>;
   if (videoOrImage === 'video' && media) {
      headerContent = (
         <video autoPlay muted loop className="video-container" style={{ width: `${mediaSize}%` }}>
            <source src={media} type={`video/mp4`} />
            Your browser does not support the video tag.
         </video>
      );
   } else if (videoOrImage === 'image' && media) {
      headerContent = (
         <img
            /* className="top-image" */ src={media}
            alt="headerImage"
            style={{ width: '100%' /* removing styles from '.adminEdit img': */, filter: 'none', opacity: 1 }}
         ></img>
      );
   }

   return (
      <Stack
         alignItems="center"
         justifyContent="space-between"
         // sx={adminEditor ? { height: '100%', maxHeight: '100vh' } : {}}
      >
         {adminEditor && (
            <Divider>
               <h2>Edit img/video</h2>
            </Divider>
         )}
         <Stack
            className="header-container"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: '100%', height: 'auto' }}
         >
            {/* <Box className="header-container" sx={{ width: `${mediaSize}vw`, height: 'auto' }}> */}
            {headerContent}
            {isEditing && null}

            <div
               className="box-text-over-video black-layer"
               style={{
                  width: '100%',
                  height: mediaSize === 34338563 ? '100%' : 'auto',
                  transform: `scale(${mediaSize}%)`,
                  transformOrigin: 'top center',
               }}
            >
               <h1 className="text-over-video">{textFields.title}</h1>
               <h3 className="text-over-video">{textFields.description}</h3>
               <h2 className="text-over-video">
                  {textFields.time} {'•'} {textFields.location}
               </h2>
               <p>
                  <img className="move-arrow" src={arrowDown} />
               </p>
               {isEditing && <TextEditDialog textFields={textFields} onEditing={setEditing} onSubmit={textEditHandler} />}
            </div>
         </Stack>
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
                  boxSizing: 'border-box',
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
                  <ImageButtonFileUpload order={1} sectionID={sectionID} sectionName={'fullScreenMedia'} />
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
