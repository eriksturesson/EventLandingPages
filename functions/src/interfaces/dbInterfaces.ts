import { SectionContent } from './sectionInterfaces';
import { SiteSettingsData } from './SettingsInterfaces';

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
   media?: string; // url to storage
   mediaType?: 'video' | 'image';
   overlayOpacity?: number;
}

export interface DBHomePageContentPitchCards {
   image?: string; // url to storage
   title?: string;
   description?: string;
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
   fullName?: string;
   description?: string;
   image?: string;
   pitch?: string;
   title?: string;
   titleDescription?: string;
   id: string;
   order: number;
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
   [key: string]: DBOneParticipant;
}

export interface DBOrganizersKey {
   [id: string]: OrganizerObject;
}

export interface OrganizerObject {
   image: string;
   id: string;
   order: number;
}

export interface QuillContent {
   text: string;
   timestamp: Date;
}

// export interface DBHomePageContent {
//    fullScreenMedia?: DBFullScreenMedia;
//    speakers?: DBSpeakersKey;
//    participants?: DBParticipantKey;
//    organizers?: DBOrganizersKey;
//    pitchCards?: DBPitchCardKey;
//    quillContent?: QuillContent;
//    callToActionButton?: DBHomePageContentButton;
//    footer?: DBHomePageContentFooter;
//    //HeadingSection?: HeadingSectionTypes;

//    // timestamp: string;
// }

export interface HeadingSectionTypes {
   text: string;
   size: 2 | 3 | 4;
}

export type Content =
   | DBFullScreenMedia
   | DBSpeakersKey
   | DBParticipantKey
   | DBOrganizersKey
   | DBPitchCardKey
   | QuillContent
   | DBHomePageContentButton
   | DBHomePageContentFooter
   | undefined;
//| HeadingSectionTypes;

export type InitContent = {
   fullScreenMedia: DBFullScreenMedia;
   speakers: DBSpeakersKey;
   participants: DBParticipantKey;
   organizers: DBOrganizersKey;
   pitchCards: DBPitchCardKey;
   quillContent: QuillContent;
   callToActionButton: DBHomePageContentButton;
   footer: DBHomePageContentFooter;
   //HeadingSection: HeadingSectionTypes;
};

export interface DBAdminUser {
   id: string;
   email: string;
   invitedAt: string;
   inviteID: string;
   invitedByUserID: string;
   invitedByEmail: string;
   active: boolean;
   role: 'admin' | 'content creator' | 'superuser';
}
export interface DBAdminUserWithAuthMeta extends DBAdminUser {
   lastLogin?: string; // ISO 8601
   createdAt?: string; // ISO 8601
}
export interface DBAdminUsers {
   [userID: string]: DBAdminUser;
}

export interface DBAdminWebsiteKeys {
   [websiteID: string]: DBAdminUsers;
}

export interface PageMetadata {
   pageName: string;
   pageLink: string;
   pageID: string;
}

export interface DBCustomPages {
   metadata: PageMetadata;
   content: Record<string, SectionContent>; // sectionID -> content
}
export interface DbEachWebsite {
   homepageContent: Record<string, SectionContent>;
   customPages: DBCustomPages;
   settings: SiteSettingsData;
}
export interface DBEachWebsiteKey {
   [websiteID: string]: DbEachWebsite;
}

export interface DBWebsiteIDs {
   websiteHostName: string;
   websiteID: string;
   created: string;
}

export interface DBWebsiteIdKey {
   [websiteID: string]: DBWebsiteIDs;
}

export interface InvitedAdmin {
   email: string;
   role: 'admin' | 'content creator' | 'superuser';
   websiteID: string;
   invitedByUserID: string;
   invitedByEmail: string;
   invitedAt: string; // ISO date string
   accepted: boolean;
   inviteID: string;
}

export interface InvitedIDKeys {
   [inviteID: string]: InvitedAdmin;
}
export interface InvitedAdminsWebsiteKeys {
   [websiteID: string]: InvitedIDKeys;
}

export interface DBRoot {
   invitedAdmins: InvitedAdminsWebsiteKeys;
   admins: DBAdminWebsiteKeys;
   websiteIds: DBWebsiteIdKey;
   websites: DBEachWebsiteKey;
}
