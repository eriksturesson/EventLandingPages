import { Content } from './components/interfaces/dbInterfaces';
import { SectionContent, SectionIDs, SectionProps } from './components/interfaces/sectionInterfaces';
import { HeaderComponent } from './components/sections/ImageVideoSection/Header';
import { SpeakersComponent } from './components/sections/Speakers';
import { Footer } from './components/sections/Footer';
import { ParticipantComponent } from './components/sections/Participants';
import { OrganizersComponent } from './components/sections/Organizers';
import { QuillComponent } from './components/sections/Quill';
import { CallToActionButtonComponent } from './components/sections/CallToActionButton';
import { PitchCardsComponent } from './components/sections/PitchCards';
import { CreateSection } from './components/smallComponents/CreateSection';

interface Sections {
   [component: string]: React.FC<SectionProps>;
}

// Object for mapping each component in the JSX
const components: Sections = {
   fullScreenMedia: HeaderComponent,
   speakers: SpeakersComponent,
   footer: Footer,
   participants: ParticipantComponent,
   organizers: OrganizersComponent,
   quillContent: QuillComponent,
   pitchCards: PitchCardsComponent,
   callToActionButton: CallToActionButtonComponent,
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
                  <>
                     <Component data={section} adminEditor={props.adminEditor} key={i} />
                     {adminEditor ? <CreateSection sectionOrder={section.sectionOrder + 1} key={i} /> : null}
                  </>
               );
            })}
         </>
      );
   } else {
      console.error('No sections found in SectionLoader');
      return <CreateSection sectionOrder={1} />;
   }
};
