import { Box, Button, Grid, Slider, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import arrowDown from '../../assets/baseline_keyboard_arrow_down_white_18dp.png';
import { useDbContent } from '../../contexts/DBContentContext';
import { DBFullScreenMedia } from '../../interfaces/dbInterfaces';
import { SectionProps } from '../../interfaces/sectionInterfaces';
import { ImageButtonFileUpload } from '../smallComponents/FileUploads';
import { FullScreenMediaTextFields } from '../smallComponents/TextEditDialog';
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

   const mediaStyle: React.CSSProperties = {
      width: adminEditor ? '100%' : '100vw',
      height: 'auto',
      display: 'block',
      objectFit: 'cover',
   };

   const renderMedia = () => {
      if (!content?.media) return null;
      if (content.mediaType === 'video') {
         return (
            <video autoPlay muted loop className="video-container" style={mediaStyle}>
               <source src={content.media} type="video/mp4" />
               Your browser does not support the video tag.
            </video>
         );
      }
      return <img src={content.media} alt="header" style={mediaStyle} />;
   };

   return (
      <Stack alignItems="center" justifyContent="space-between">
         <Stack alignItems="center" justifyContent="space-between">
            <Stack
               alignItems="center"
               justifyContent="space-between"
               sx={{ width: '100%', height: 'auto', position: 'relative' }}
            >
               {renderMedia()}

               {/* Overlay */}
               <Box
                  sx={{
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     width: '100%',
                     height: '100%',
                     backgroundColor: 'black',
                     opacity: overlayOpacity / 100,
                     pointerEvents: 'none',
                     transition: 'opacity 0.3s ease',
                     zIndex: 1,
                  }}
               />

               {/* Text ovanpå video - syns bara på desktop */}
               <Stack
                  color="white"
                  textAlign="center"
                  zIndex={2}
                  width="100%"
                  alignItems="center"
                  spacing={1}
                  px={2}
                  sx={{
                     position: 'absolute',
                     top: '50%',
                     left: '50%',
                     transform: 'translate(-50%, -50%)',
                     display: { xs: 'none', sm: 'flex' }, // göm på xs (mobil), visa på sm och uppåt
                  }}
               >
                  <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'white' }}>
                     {textFields.title}
                  </Typography>
                  {textFields.description && <Typography variant="h5">{textFields.description}</Typography>}
                  {(textFields.time || textFields.location) && (
                     <Typography variant="h6">
                        {textFields.time}
                        {textFields.time && textFields.location && ' • '}
                        {textFields.location}
                     </Typography>
                  )}
                  <Box mt={2}>
                     <Box component="img" src={arrowDown} alt="Scroll down" sx={{ height: '2em' }} />
                  </Box>
               </Stack>
            </Stack>

            {/* Text UNDER video - bara på mobil */}
            <Stack
               textAlign="center"
               alignItems="center"
               spacing={0.5}
               px={2}
               sx={{
                  display: { xs: 'flex', sm: 'none' }, // visa bara på mobil
                  mt: 2,
               }}
            >
               <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {textFields.title}
               </Typography>
               {textFields.description && <Typography variant="body1">{textFields.description}</Typography>}
               {(textFields.time || textFields.location) && (
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                     {textFields.time}
                     {textFields.time && textFields.location && ' • '}
                     {textFields.location}
                  </Typography>
               )}
            </Stack>
         </Stack>

         {adminEditor && (
            <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 2, mb: 2 }}>
               <Grid item xs={12} sm="auto" display="flex" justifyContent="center">
                  <Button variant="contained" onClick={() => setEditing(true)}>
                     Edit text
                  </Button>
               </Grid>

               <Grid item xs={12} sm="auto" display="flex" justifyContent="center">
                  <ImageButtonFileUpload order={1} sectionID={sectionID} sectionName="fullScreenMedia" pageID={pageID} />
               </Grid>
               <Grid item xs={12} sm="auto" display="flex" justifyContent="center">
                  <Slider
                     aria-label="Media size"
                     value={overlayOpacity}
                     sx={{ width: '8em', flexShrink: 0 }}
                     valueLabelDisplay="auto"
                     min={0}
                     onChange={(event, value) => setOverlayOpacity(value as number)}
                  />
               </Grid>
               <Grid item xs={12} sm="auto" display="flex" justifyContent="center">
                  <Button variant="contained" onClick={saveOverlayOpacity}>
                     Save slidersize
                  </Button>
               </Grid>
            </Grid>
         )}
      </Stack>
   );
}
