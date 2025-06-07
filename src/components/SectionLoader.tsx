import { Box, Grid } from '@mui/material';
import React from 'react';
import { SectionContent, SectionProps } from '../interfaces/sectionInterfaces';
import { CallToActionButtonComponent } from './sections/CallToActionButton';
import { FooterComponent } from './sections/FooterComponent';
import { FullScreenMedia } from './sections/FullScreenMedia';
import { OrganizersComponent } from './sections/Organizers';
import { ParticipantComponent } from './sections/Participants';
import { PitchCardsComponent } from './sections/PitchCards';
import { QuillComponent } from './sections/QuillComponent';
import { SpeakersComponent } from './sections/SpeakersComponent';
import { CreateSection } from './smallComponents/CreateSection';

interface Sections {
   [component: string]: React.FC<SectionProps>;
}

// Object for mapping each component in the JSX
const components: Sections = {
   fullScreenMedia: FullScreenMedia,
   speakers: SpeakersComponent,
   footer: FooterComponent,
   participants: ParticipantComponent,
   organizers: OrganizersComponent,
   quillContent: QuillComponent,
   pitchCards: PitchCardsComponent,
   callToActionButton: CallToActionButtonComponent,
};
interface Props {
   data: SectionContent[];
   adminEditor: boolean;
   pageID: string | null;
}

export const SectionLoader: React.FC<Props> = function (props) {
   const { adminEditor, data, pageID } = props;
   // console.log('sections', sections);
   if (data && data.length > 0) {
      const sortedData = data.sort((a, b) => a.sectionOrder - b.sectionOrder);

      return (
         <Box sx={{ textAlign: 'center', contentAlign: 'center' }}>
            {sortedData.map((section) => {
               // console.log('section:', section);
               // console.log('sectionName:', section.sectionName);
               const Component = components[section.sectionName];
               const sectionData = section.content;
               if (!sectionData && !adminEditor) {
                  //hidden for non-admin
                  return null;
               }
               if (!Component) {
                  // console.error('Section:', section);
                  //console.error(`Failed to render module ${section.sectionName}. Check spelling.`);

                  return null;
               }

               return (
                  <Grid key={section.sectionID}>
                     <Grid item sm={12}>
                        <Component data={section} adminEditor={props.adminEditor} pageID={pageID} />
                     </Grid>
                     {adminEditor ? (
                        <Grid item sm={12}>
                           <CreateSection sectionOrder={section.sectionOrder + 1} pageID={pageID} />
                        </Grid>
                     ) : null}
                  </Grid>
               );
            })}
         </Box>
      );
   } else {
      if (adminEditor) {
         return (
            <Box sx={{ textAlign: 'center', contentAlign: 'center' }}>
               <Grid>
                  <Grid item sm={12}>
                     <CreateSection sectionOrder={1} pageID={pageID} />
                  </Grid>
               </Grid>
            </Box>
         );
      } else {
         return (
            <Box sx={{ textAlign: 'center', marginTop: '5rem', contentAlign: 'center' }}>
               Admin has not created any content yet
            </Box>
         );
      }
   }
};
