import { Content } from './dbInterfaces';

export interface SectionContent {
   sectionName: SectionTypes;
   content?: Content;
   sectionID: string;
   sectionOrder: number;
   createdAt: Date;
   updatedAt: Date;
}

export interface CustomPageSectionContent extends SectionContent {
   pageName: string;
   pageLink: string;
}

export interface SectionIDs {
   [sectionID: string]: SectionContent;
}

export interface SectionProps {
   data: SectionContent;
   adminEditor: boolean;
}

export type SectionTypes =
   | 'fullScreenMedia'
   | 'speakers'
   | 'participants'
   | 'organizers'
   | 'quillContent'
   | 'pitchCards'
   | 'callToActionButton'
   | 'footer';
//| 'HeadingSection';

export const sectionTypes: SectionTypes[] = [
   'fullScreenMedia',
   'speakers',
   'participants',
   'organizers',
   'quillContent',
   'pitchCards',
   'callToActionButton',
   'footer',
];
