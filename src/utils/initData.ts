import TestImage from '../../assets/DSC02755.JPG';
import mapImageExample from '../../assets/mapImageExample.png';
import speakerImgExample1 from '../../assets/speakerImgExample1.jpg';
import speakerImgExample2 from '../../assets/speakerImgExample2.jpg';
import speakerImgExample3 from '../../assets/speakerImgExample3.jpg';
import rotaryVideomp4 from '../../assets/VideoStockholmCityAffarsnatverk_Trim_min.mp4';
import { DBFullScreenMedia, DBSpeaker, DBSpeakersKey, InitContent } from '../interfaces/dbInterfaces';
import { SectionIDs } from '../interfaces/sectionInterfaces';

const initSectionDataOnNewCreation: InitContent = {
   fullScreenMedia: {
      title: 'Welcome to the event!',
      description: 'This is the description of the event',
      media: rotaryVideomp4,
      mediaType: 'video',
      time: 'ONS 6 SEP KL.18.00 - 21.00',
      location: 'M / S VINDHEM, SKEPPSBRON - KAJPLATS 101',
      mediaSize: 100,
   },
   speakers: {
      speakerskey1: {
         fullName: 'Jane Jones',
         description: 'With experience in ...',
         image: (window.location.origin + speakerImgExample1) as unknown as string,
         pitch: 'I am a speaker',
         title: 'CEO of Company X',
         titleDescription: 'I am the CEO of Company X',
         id: 'speakerskey1',
         order: 1,
      },
      speakerskey2: {
         fullName: 'Sofie Wattson',
         description: 'My name is Sofie Wattson and I am a speaker',
         image: (window.location.origin + speakerImgExample2) as unknown as string,
         pitch: 'I am a speaker',
         title: 'CEO of Company Y',
         titleDescription: 'I am the CEO of Company Y',
         id: 'speakerskey2',
         order: 2,
      },
      speakerskey3: {
         fullName: 'John Doe',
         description: 'My name is John Doe and I am a speaker',
         image: (window.location.origin + speakerImgExample3) as unknown as string,
         pitch: 'I am a speaker',
         title: 'CEO of Company Z',
         titleDescription: 'I am the CEO of Company Z',
         id: 'speakerskey3',
         order: 3,
      },
   },
   participants: {
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
   organizers: {
      organizerskey1: {
         image: (window.location.origin + speakerImgExample1) as unknown as string,
         id: 'organizerskey1',
         order: 1,
      },
      organizerskey2: {
         image: (window.location.origin + speakerImgExample2) as unknown as string,
         id: 'organizerskey2',
         order: 2,
      },
   },
   pitchCards: {
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
      sectionOrder: 1,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      content: {
         logo: '',
         video: '',
         image: '',
         mediaSize: 100,
      } as DBFullScreenMedia,
   },
   ugois8934ifre: {
      sectionName: 'speakers',
      sectionID: 'ugois8934ifre',
      sectionOrder: 2,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      content: {
         geshfnoesriasf: {
            fullName: 'Test Testsson',
            description: 'This speaker is sooo awesome!',
            image: TestImage,
            pitch: 'I am such a good speaker.',
            title: 'Hero Speaker',
            titleDescription: 'In how many ways do I need to say this?',
            id: '098432oh432432ij432',
         } as DBSpeaker,
      } as DBSpeakersKey,
   },
};
