import { Content } from './components/interfaces/dbInterfaces';
import { SectionContent, SectionIDs, SectionProps } from './components/interfaces/sectionInterfaces';
import { FullScreenMedia } from './components/sections/ImageVideoSection/Header';
import { SpeakersComponent } from './components/sections/Speakers';
import { Footer } from './components/sections/Footer';
import { ParticipantComponent } from './components/sections/Participants';
import { OrganizersComponent } from './components/sections/Organizers';
import { QuillComponent } from './components/sections/Quill';
import { CallToActionButtonComponent } from './components/sections/CallToActionButton';
import { PitchCardsComponent } from './components/sections/PitchCards';
import { CreateSection } from './components/smallComponents/CreateSection';
import HeadingSection from './components/sections/HeadingSection';
import { Grid } from '@mui/material';

interface Sections {
   [component: string]: React.FC<SectionProps>;
}

// Object for mapping each component in the JSX
const components: Sections = {
   fullScreenMedia: FullScreenMedia,
   speakers: SpeakersComponent,
   footer: Footer,
   participants: ParticipantComponent,
   organizers: OrganizersComponent,
   quillContent: QuillComponent,
   pitchCards: PitchCardsComponent,
   callToActionButton: CallToActionButtonComponent,
   HeadingSection: HeadingSection,
};
interface Props {
   data: SectionIDs;
   adminEditor: boolean;
}

export const SectionLoader: React.FC<Props> = function (props) {
   const { adminEditor, data } = props;
   const sections: SectionContent[] = Object.values(data);
   // console.log('sections', sections);
   if (sections) {
      sections.sort((a, b) => a.sectionOrder - b.sectionOrder);
      return (
         <>
            {sections.map((section, i) => {
               // console.log('section:', section);
               // console.log('sectionName:', section.sectionName);
               const Component = components[section.sectionName];
               const sectionData = section.content;
               if (!Component) {
                  console.error(`Failed to render module ${section.sectionName}. Check spelling.`);
                  return null;
               }

               return (
                  <Grid key={i}>
                     <Grid item sm={12}>
                        <Component data={section} adminEditor={props.adminEditor} />
                     </Grid>
                     {adminEditor ? (
                        <Grid item sm={12}>
                           <CreateSection sectionOrder={section.sectionOrder + 1} />
                        </Grid>
                     ) : null}
                  </Grid>
               );
            })}
         </>
      );
   } else {
      console.error('No sections found in SectionLoader');
      return <CreateSection sectionOrder={1} />;
   }
};
