import { Content, DBFullScreenMedia, DBSpeaker, DBSpeakersKey, InitContent } from '../interfaces/dbInterfaces';
import speakerImgExample1 from '../../assets/speakerImgExample1.jpg';
import speakerImgExample2 from '../../assets/speakerImgExample2.jpg';
import speakerImgExample3 from '../../assets/speakerImgExample3.jpg';
import fullscreenMediaExample1 from '../../assets/fullscreenMediaExample1.jpg';
import mapImageExample from '../../assets/mapImageExample.png';
import { SectionIDs } from '../interfaces/sectionInterfaces';
import TestImage from '../../assets/DSC02755.JPG';

export const initSectionDataOnNewCreation: InitContent = {
   fullScreenMedia: {
      title: 'Welcome to the event!',
      description: 'This is the description of the event',
      image: (window.location.origin + { fullscreenMediaExample1 }) as unknown as string,
      //video: "",
      //logo: "",
   },
   speakers: {
      title: 'Speakers',
      items: {
         speakerskey1: {
            speakerName: 'Jane Jones',
            speakerDescription: 'With experience in ...',
            speakerImage: (window.location.origin + speakerImgExample1) as unknown as string,
            speakerPitch: 'I am a speaker',
            speakerTitle: 'CEO of Company X',
            speakerTitleDescription: 'I am the CEO of Company X',
            speakerID: 'speakerskey1',
            speakerOrder: 1,
         },
         speakerskey2: {
            speakerName: 'Sofie Wattson',
            speakerDescription: 'My name is Sofie Wattson and I am a speaker',
            speakerImage: (window.location.origin + speakerImgExample2) as unknown as string,
            speakerPitch: 'I am a speaker',
            speakerTitle: 'CEO of Company Y',
            speakerTitleDescription: 'I am the CEO of Company Y',
            speakerID: 'speakerskey2',
            speakerOrder: 2,
         },
         speakerskey3: {
            speakerName: 'John Doe',
            speakerDescription: 'My name is John Doe and I am a speaker',
            speakerImage: (window.location.origin + speakerImgExample3) as unknown as string,
            speakerPitch: 'I am a speaker',
            speakerTitle: 'CEO of Company Z',
            speakerTitleDescription: 'I am the CEO of Company Z',
            speakerID: 'speakerskey3',
            speakerOrder: 3,
         },
      },
   },
   participants: {
      title: 'Participants',
      items: {
         participantskey1: {
            image: (window.location.origin + speakerImgExample1) as unknown as string,
            name: 'Jane Jones',
            title: 'CEO',
            organization: 'Company X',
            id: 'participantskey1',
            order: 1,
         },
         participantskey2: {
            image: (window.location.origin + speakerImgExample2) as unknown as string,
            name: 'Sofie Wattson',
            title: 'CEO',
            organization: 'Company Y',
            id: 'participantskey2',
            order: 2,
         },
         participantskey3: {
            image: (window.location.origin + speakerImgExample3) as unknown as string,
            name: 'John Doe',
            title: 'CEO',
            organization: 'Company Z',
            id: 'participantskey3',
            order: 3,
         },
      },
   },
   organizers: {
      title: 'Organizers',
      items: {
         organizerskey1: {
            logo: (window.location.origin + speakerImgExample1) as unknown as string,
            id: 'organizerskey1',
            order: 1,
         },
         organizerskey2: {
            logo: (window.location.origin + speakerImgExample2) as unknown as string,
            id: 'organizerskey2',
            order: 2,
         },
      },
   },
   pitchCards: {
      title: 'Pitch Cards',
      items: {
         pitchCardskey1: {
            title: 'Pitch Card 1',
            description: 'This is the description of Pitch Card 1',
            image: (window.location.origin + speakerImgExample1) as unknown as string,
            id: 'pitchCardskey1',
            order: 1,
         },
         pitchCardskey2: {
            title: 'Pitch Card 2',
            description: 'This is the description of Pitch Card 2',
            image: (window.location.origin + speakerImgExample2) as unknown as string,
            id: 'pitchCardskey2',
            order: 2,
         },
         pitchCardskey3: {
            title: 'Pitch Card 3',
            description: 'This is the description of Pitch Card 3',
            image: (window.location.origin + speakerImgExample3) as unknown as string,
            id: 'pitchCardskey3',
            order: 3,
         },
      },
   },
   quillContent: {
      text: 'Example text from quill editor',
      timestamp: new Date(),
   },
   callToActionButton: {
      formLink: 'https://www.google.com/',
      buttonText: 'Example button text',
      buttonInfo: 'Extra example info below button',
      buttonColor: 'green',
   },
   footer: {
      integrityPolicy: 'https://www.google.com/',
      integrityPolicyDescription: 'Our Integrity Policy',
      contactTitle: 'Example contact title',
      contactName: 'Example contact name',
      contactEmail: 'example@example.com',
      contactPhone: '+00 123 45 678',
      adressTitle: 'Example adress title',
      contactAddress1: 'Example adress 1',
      contactAddress2: 'Example adress 2',
      mapImage: (window.location.origin + mapImageExample) as unknown as string,
   },
};

export const initialState: SectionIDs = {
   uionsgrngnen: {
      sectionID: 'uionsgrngnen',
      sectionName: 'fullScreenMedia',
      sectionOrder: '0',
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      content: {
         logo: '',
         video: '',
         image: '',
      } as DBFullScreenMedia,
   },
   ugois8934ifre: {
      sectionName: 'speakers',
      sectionID: 'ugois8934ifre',
      sectionOrder: '0',
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      content: {
         title: 'Speakers',
         items: {
            geshfnoesriasf: {
               speakerName: 'Test Testsson',
               speakerDescription: 'This speaker is sooo awesome!',
               speakerImage: TestImage,
               speakerPitch: 'I am such a good speaker.',
               speakerTitle: 'Hero Speaker',
               speakerTitleDescription: 'In how many ways do I need to say this?',
               speakerID: '098432oh432432ij432',
            } as DBSpeaker,
         },
      } as DBSpeakersKey,
   },
};
