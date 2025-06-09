import { Button, Slider, Stack } from '@mui/material';
import { useState } from 'react';
import arrowDown from '../../assets/baseline_keyboard_arrow_down_white_18dp.png';
import { useDbContent } from '../../contexts/DBContentContext';
import { DBFullScreenMedia } from '../../interfaces/dbInterfaces';
import { SectionProps } from '../../interfaces/sectionInterfaces';
import { ImageButtonFileUpload } from '../smallComponents/FileUploads';
import TextEditDialog, { FullScreenMediaTextFields } from '../smallComponents/TextEditDialog';
import { handleSaveTexts } from '../smallComponents/TextEdits';

export function FullScreenMedia({ adminEditor, data, pageID }: SectionProps): JSX.Element {
   const { websiteID } = useDbContent();
   const sectionID = data.sectionID;
   const content = data.content as DBFullScreenMedia | null;

   const [isEditing, setEditing] = useState(false);
   const [overlayOpacity, setOverlayOpacity] = useState(content?.overlayOpacity ?? 0);
   const [textFields, setTextFields] = useState<FullScreenMediaTextFields>({
      title: content?.title || '',
      description: content?.description || '',
      time: content?.time || '',
      location: content?.location || '',
   });

   const refBelowWebsiteID = pageID
      ? `customPages/${pageID}/content/${sectionID}/content/`
      : `homepageContent/${sectionID}/content/`;

   const handleTextSubmit = (updatedData: FullScreenMediaTextFields) => {
      handleSaveTexts({ refBelowWebsiteID, data: updatedData, websiteID });
      setEditing(false);
      setTextFields(updatedData);
   };

   const saveOverlayOpacity = () => {
      handleSaveTexts({
         refBelowWebsiteID,
         data: { overlayOpacity },
         websiteID,
      });
   };

   const renderMedia = () => {
      if (!content?.media) return null;
      if (content.mediaType === 'video') {
         return (
            <video
               autoPlay
               muted
               loop
               className="video-container"
               style={{ width: '100%', height: 'auto', display: 'block' }}
            >
               <source src={content.media} type="video/mp4" />
               Your browser does not support the video tag.
            </video>
         );
      }
      return (
         <img
            src={content.media}
            alt="header"
            style={{
               width: '100%',
               height: 'auto',
               display: 'block',
            }}
         />
      );
   };

   return (
      <Stack alignItems="center" justifyContent="space-between">
         <Stack
            className="header-container"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: '100%', height: 'auto', position: 'relative' }}
         >
            {renderMedia()}
            {/* Svart overlay som täcker hela media och har justerbar opacity */}
            <div
               style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'black',
                  opacity: overlayOpacity / 100,
                  pointerEvents: 'none', // så att overlay inte blockar klick osv
                  transition: 'opacity 0.3s ease',
                  zIndex: 1,
               }}
            />
            <div
               className="box-text-over-video black-layer"
               style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  textAlign: 'center',
                  zIndex: 2,
                  width: '100%',
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
               {isEditing && <TextEditDialog textFields={textFields} onEditing={setEditing} onSubmit={handleTextSubmit} />}
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
               <Button variant="contained" onClick={() => setEditing(true)}>
                  Edit text
               </Button>
               <Stack spacing={2} direction="row">
                  <ImageButtonFileUpload order={1} sectionID={sectionID} sectionName="fullScreenMedia" pageID={pageID} />
                  <Slider
                     aria-label="Media size"
                     value={overlayOpacity}
                     sx={{ width: '8em', flexShrink: 0 }}
                     valueLabelDisplay="auto"
                     min={0}
                     onChange={(event, value) => setOverlayOpacity(value as number)}
                  />
                  <Button variant="contained" onClick={saveOverlayOpacity}>
                     Save slidersize
                  </Button>
               </Stack>
            </Stack>
         )}
      </Stack>
   );
}
