import { SectionTypes, Content } from './dbInterfaces';

export interface SectionContent {
   sectionName: SectionTypes;
   content: Content;
   id: string;
   order: string;
   createdAt: Date;
   updatedAt: Date;
}

export interface SectionIDs {
   [firebaseID: string]: SectionContent;
}

export interface SectionProps {
   data: SectionContent;
   adminEditor: boolean;
}
