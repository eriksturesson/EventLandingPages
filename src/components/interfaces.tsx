export interface DBFullScreenMediaMetaData {
   metaDescription: string;
   metaKeywords: string;
   metaTitle: string;
   metaUrl: string;
   metaImage: string; // url to storage
   metaRobots: string;
}

export interface DBFullScreenMedia {
   metaData?: DBFullScreenMediaMetaData;
   title?: string;
   description?: string;
   time?: string;
   location?: string;
   logo: string; // url to storage
   video: string; // url to storage
   image: string; // url to storage
}

export interface DBHomePageContentPitchCards {
   image: string; // url to storage
   title: string;
   description: string;
   order: number;
   id: string;
}

export interface DBPitchCardKey {
   [key: string]: DBHomePageContentPitchCards;
}

export interface DBHomePageContentButton {
   formLink: string;
   buttonText: string;
   buttonInfo: string;
   buttonColor?: string;
}

export interface DBHomePageContentFooter {
   integrityPolicy: string; //URL to integritypolicy
   integrityPolicyDescription: string;
   contactName?: string;
   contactEmail: string;
   contactPhone?: string;
   adressTitle?: string;
   contactTitle?: string;
   contactAddress1: string;
   contactAddress2: string;
   mapImage: string; // url to storage
}
export interface DBSpeakersKey {
   [key: string]: DBSpeaker;
}

export interface DBSpeaker {
   speakerName?: string;
   speakerDescription?: string;
   speakerImage?: string;
   speakerPitch?: string;
   speakerTitle?: string;
   speakerTitleDescription?: string;
   speakerID: string;
}

export interface DBOneParticipant {
   image?: string;
   name?: string;
   title?: string;
   organization?: string;
   id: string;
   order: number;
}

export interface DBParticipantKey {
   title: string;
   [key: string]: string | DBOneParticipant;
}

export interface EventSchedule {
   scheduleName: string;
   [anyStringWithWhatHappensThatTime: string]: string;
}

export interface DBOrganizersKey {
   title: string;
   [logoOfOrganizer: string]: string | OrganizerObject;
}

export interface OrganizerObject {
   logo: string;
}

export interface QuillObject {
   text: string;
   timestamp: string;
}
export interface DBHomePageContent {
   fullScreenMedia: DBFullScreenMedia;
   speakers: DBSpeakersKey;
   participants: DBParticipantKey;
   organizers: DBOrganizersKey;
   eventSchedule: EventSchedule;
   pitchCards: DBPitchCardKey;
   quillContent: QuillObject;
   button: DBHomePageContentButton;
   footer: DBHomePageContentFooter;
   // timestamp: string;
}

export type Content =
   | DBFullScreenMedia
   | DBSpeakersKey
   | DBParticipantKey
   | DBOrganizersKey
   | EventSchedule
   | DBPitchCardKey
   | QuillObject
   | DBHomePageContentButton
   | DBHomePageContentFooter;

export interface SectionContent {
   sectionName: SectionTypes;
   content: Content;
   id: string;
   order: string;
   createdAt: Date;
   updatedAt: Date;
   DB?: boolean;
}

export interface DBAdminPageContent {}

export interface DBSubPageContent {
   header: DBFullScreenMedia;
   quillContent: string;
}

export interface SectionIDs {
   [firebaseID: string]: SectionContent;
}

export type SectionTypes =
   | 'DBFullScreenMedia'
   | 'footer'
   | 'speakers'
   | 'participants'
   | 'organizers'
   | 'quillContent'
   | 'callToActionButton'
   | 'footer';

export interface DB {
   websiteHostName: string;
   homepageContent: SectionIDs;
   adminpageContent: DBAdminPageContent;
   subpages: DBSubPageContent[];
}

export interface DBs {
   [websiteID: string]: DB;
}
export interface DBAdminUsers {
   [userID: string]: {
      [websiteID: string]: string;
      Email: string;
      LastTimeSavedData: string;
   }; //Not done, maybe even not needed
}

export interface DBUsers {
   [userID: string]: {
      Email: string;
      LastTimeSavedData: string;
   }; //Not done, maybe even not needed
}

export interface DBWebsitesIDs {
   [websiteID: string]: {
      websiteHostName: string;
      websiteID: string;
      created: string;
   };
}
export interface DB {
   websites: DB;
   websitesIds: DBWebsitesIDs;
   users: DBUsers;
   adminUsers: DBAdminUsers;
}
