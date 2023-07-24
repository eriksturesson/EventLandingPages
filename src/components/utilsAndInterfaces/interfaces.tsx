export interface StandardWebPageContentHeaderMetaData {
   metaDescription: string;
   metaKeywords: string;
   metaTitle: string;
   metaUrl: string;
   metaImage: string; // url to storage
   metaRobots: string;
}

export interface StandardWebPageContentHeader {
   metaData?: StandardWebPageContentHeaderMetaData;
   title?: string;
   description?: string;
   time?: string;
   location?: string;
   logo: string; // url to storage
   video: string; // url to storage
   image: string; // url to storage
}

export interface DBWebsiteHomePageContentPitchCards {
   image: string; // url to storage
   title: string;
   description: string;
   order: number;
   id: string;
}

export interface DBWebsitePitchCardKey {
   [key: string]: DBWebsiteHomePageContentPitchCards;
}

export interface DBWebsiteHomePageContentButton {
   formLink: string;
   buttonText: string;
   buttonInfo: string;
   buttonColor?: string;
}

export interface DBWebsiteHomePageContentFooter {
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
export interface DBWebsiteSpeakersKey {
   [key: string]: DBWebsiteSpeaker;
}

export interface DBWebsiteSpeaker {
   speakerName?: string;
   speakerDescription?: string;
   speakerImage?: string;
   speakerPitch?: string;
   speakerTitle?: string;
   speakerTitleDescription?: string;
   speakerID: string;
}

export interface DBWebsiteOneParticipant {
   image?: string;
   name?: string;
   title?: string;
   organization?: string;
   id: string;
}

export interface DBWebsiteParticipantKey {
   title: string;
   [key: string]: string | DBWebsiteOneParticipant;
}

export interface EventSchedule {
   scheduleName: string;
   [anyStringWithWhatHappensThatTime: string]: string;
}

export interface DBWebsiteOrganizersKey {
   title: string;
   [logoOfOrganizer: string]: string | OrganizerObject;
}

export interface OrganizerObject {
   logo: string;
}
export interface DBWebsiteHomePageContent {
   header: StandardWebPageContentHeader;
   speakers: DBWebsiteSpeakersKey;
   participants: DBWebsiteParticipantKey;
   organizers: DBWebsiteOrganizersKey;
   eventSchedule: EventSchedule;
   pitchCards: DBWebsitePitchCardKey;
   quillContent: string;
   button: DBWebsiteHomePageContentButton;
   footer: DBWebsiteHomePageContentFooter;
   timestamp: string;
}

export interface DBWebsiteAdminPageContent {}

export interface DBWebsiteSubPageContent {
   header: StandardWebPageContentHeader;
   quillContent: string;
}

export interface DBWebsite {
   websiteHostName: string;
   homepageContent: DBWebsiteHomePageContent;
   adminpageContent: DBWebsiteAdminPageContent;
   subpages: DBWebsiteSubPageContent[];
}

export interface DBWebsites {
   [websiteID: string]: DBWebsite;
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
   websites: DBWebsite;
   websitesIds: DBWebsitesIDs;
   users: DBUsers;
   adminUsers: DBAdminUsers;
}
