import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import { motion } from 'motion/react';
import React from 'react';
import { calculateNextOrder } from '../helpers/calculateNextOrder';
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
import { RemoveSectionComponent } from './smallComponents/RemoveSection';

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
      const length = sortedData.length;
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
                        {adminEditor ? (
                           <>
                              <Paper elevation={6} sx={{ p: 2, mt: 2, mb: 2 }}>
                                 <Divider sx={{ mb: 2, mt: 2 }}>
                                    <Typography fontStyle={'italic'} variant="h4">
                                       {section?.sectionName
                                          ? section.sectionName.charAt(0).toUpperCase() + section.sectionName.slice(1)
                                          : 'Edit section'}
                                    </Typography>
                                 </Divider>
                                 <RemoveSectionComponent
                                    pageID={pageID}
                                    sectionID={section.sectionID}
                                    sectionName={section.sectionName}
                                 />
                                 <Component data={section} adminEditor={props.adminEditor} pageID={pageID} />
                              </Paper>
                              <Paper elevation={6} sx={{ p: 2, mt: 2, mb: 2 }}>
                                 <Grid item sm={12}>
                                    <CreateSection
                                       sectionOrder={calculateNextOrder(sortedData, section.sectionOrder)}
                                       pageID={pageID}
                                    />
                                 </Grid>
                              </Paper>
                           </>
                        ) : (
                           <motion.div
                              initial="hidden"
                              whileInView="visible"
                              viewport={{ once: true, amount: 0 }}
                              variants={{
                                 hidden: { opacity: 0, y: 50 }, // Startposition: osynlig och nedanför
                                 visible: { opacity: 1, y: 0 }, // Slutposition när synlig
                              }}
                              transition={{
                                 type: 'spring',

                                 stiffness: 100,
                                 damping: 25,
                              }}
                           >
                              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                                 <Component data={section} adminEditor={props.adminEditor} pageID={pageID} />
                              </motion.div>
                           </motion.div>
                        )}
                     </Grid>
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
