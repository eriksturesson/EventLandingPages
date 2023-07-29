import { Content } from './components/interfaces/dbInterfaces';
import { SectionContent, SectionIDs, SectionProps } from './components/interfaces/sectionInterfaces';
import { HeaderComponent } from './components/sections/Header';
import { SpeakersComponent } from './components/sections/Speakers';
import { Footer } from './components/sections/Footer';
import { ParticipantComponent } from './components/sections/Participants';
import { OrganizersComponent } from './components/sections/Organizers';
import { ShowQuillContent } from './components/sections/Quill';

interface Sections {
   [component: string]: React.FC<SectionProps>;
}

// Object for mapping each component in the JSX
const components: Sections = {
   fullScreenMedia: HeaderComponent,
   speakers: SpeakersComponent,
   // footer: Footer,
   // participants: ParticipantComponent,
   // organizers: OrganizersComponent,
   // quillContent: ShowQuillContent,
   // callToActionButton: RegisterButtonComponent
};
interface Props {
   data: SectionIDs;
   adminEditor: boolean;
}

export const SectionLoader: React.FC<Props> = function (props) {
   const sections: SectionContent[] = Object.values(props.data);
   console.log(sections);
   return (
      <>
         {sections.map((section, i) => {
            const Component = components[section.sectionName];
            const sectionData = section.content;
            if (!Component) {
               console.error(`Failed to render module ${section.sectionName}. Check spelling.`);
               return null;
            }

            return <Component data={section} adminEditor={props.adminEditor} key={`${section.sectionName}-${i}`} />;
         })}
      </>
   );
};
