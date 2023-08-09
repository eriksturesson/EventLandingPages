import visningsbild1 from '../../assets/DSC01125.JPG';
import visningsbild2 from '../../assets/DSC01286.JPG';
import visningsbild3 from '../../assets/DSC02755.JPG';
import speakerImgExample1 from '../../assets/speakerImgExample1.jpg';
import briefcaseExample from '../../assets/briefcaseExample.png';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import react, { useState } from 'react';
import { DBHomePageContent, DBHomePageContentPitchCards, DBPitchCardKey } from '../interfaces/dbInterfaces';
import { Box, Button, Divider, Stack, SvgIcon, TextField } from '@mui/material';
import { deleteObject, getStorage, ref, uploadBytes } from 'firebase/storage';
import { db, devSettings, storage } from '../utils/firebase';
import { child, push, ref as dbRef, set, update, onChildAdded } from 'firebase/database';
import { WEBSITE_ID } from '../../App';
import { EditText, SaveTextsButton } from '../smallComponents/TextEdits';
import { ImageButtonFileUpload, NewImgBoxFileUpload } from '../smallComponents/FileUploads';
import { SectionProps, SectionTypes } from '../interfaces/sectionInterfaces';

interface OnePitchCardProps {
   adminEditor?: boolean;
   img: string;
   order: number;
   initTitle: string;
   initDescription: string;
   newCard?: true;
   id?: string;
   sectionID: string;
   sectionName: SectionTypes;
}

const AddNewPitchCard = ({ sectionID, cardOrderNr }: { sectionID: string; cardOrderNr: number }): JSX.Element => {
   return (
      <Box
         minHeight="10rem"
         sx={{
            textAlign: 'center',
            width: '100%',
            backgroundColor: 'grey',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3,
            marginBottom: '2rem',
         }}
      >
         <Box
            sx={{
               textAlign: 'center',
               position: 'absolute',
               zIndex: 1,
            }}
         >
            <SvgIcon component={AddPhotoAlternateIcon} fontSize="large" />
            <br></br>
            <ImageButtonFileUpload sectionID={sectionID} sectionName={'pitchCards'} cardOrderNr={cardOrderNr} />
         </Box>
         <img className="participant-image" src={briefcaseExample} />
      </Box>
   );

   // below creates warning: "unreachable code after return statement"
   /*    return (
      <Box
         minHeight="10rem"
         sx={{
            width: '100%',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
         }}
      >
         <SvgIcon
            sx={{
               textAlign: 'center',
               position: 'absolute',
               zIndex: 1,
            }}
            component={AddPhotoAlternateIcon}
            fontSize="large"
         />
         <img className="participant-image" src={briefcaseExample} />
      </Box>
   ); */
};
export function OnePitchCard(props: OnePitchCardProps): JSX.Element {
   const { adminEditor, img, order, initTitle, initDescription, newCard, id, sectionID, sectionName } = props;
   const [title, setTitle] = useState(initTitle);
   const [description, setDescription] = useState(initDescription);

   const handleTitleChange = (event: any) => {
      let text: string = event.target.value;
      setTitle(text);
   };

   const handleDescriptionChange = (event: any) => {
      let text: string = event.target.value;
      setDescription(text);
   };

   const removePitchCard = (id: string, imgStorageRef: string) => {
      return () => {
         //Remove from db
         const pitchCardsRef = dbRef(db, `websites/${WEBSITE_ID}/homepageContent/${sectionID}/content/${id}`);
         set(pitchCardsRef, null);
         // Create a reference to the file to delete from Storage
         const pitchCardImgRefInStorage = ref(storage, imgStorageRef);

         // Delete the file
         deleteObject(pitchCardImgRefInStorage)
            .then(() => {
               // File deleted successfully
               console.log('File deleted successfully');
            })
            .catch((error) => {
               // Uh-oh, an error occurred!
               console.log('Error deleting file');
            });
      };
   };

   return (
      <Box className="pitchcard-container" id={id}>
         <Box className="pitchcard-box">
            {adminEditor && id && !newCard ? (
               <Box
                  sx={{
                     marginTop: '1rem',
                     backgroundColor: 'grey',
                     textAlign: 'left',
                     width: '100%',
                     display: 'flex',
                     alignItems: 'center',
                  }}
               >
                  <SvgIcon
                     style={{ color: 'red', cursor: 'pointer' }}
                     onClick={removePitchCard(id, img)}
                     component={DeleteIcon}
                     fontSize="large"
                  />
                  <Box>
                     <b>Remove entire card</b>
                  </Box>
               </Box>
            ) : null}

            {adminEditor && newCard ? (
               <>
                  <NewImgBoxFileUpload sectionID={sectionID} cardOrderNr={order} sectionName={sectionName} />

                  {/*<AddNewPitchCard sectionID={sectionID} cardOrderNr={order} />*/}
               </>
            ) : (
               <img className="visningsbilder" alt="visningsbild1" src={img} />
            )}
            {adminEditor ? <EditText onChange={handleTitleChange} initText={title} /> : <h1>{title}</h1>}
            {adminEditor ? <EditText onChange={handleDescriptionChange} initText={description} /> : <p>{description}</p>}
            {adminEditor ? (
               <SaveTextsButton
                  refBelowWebsiteID={`homepageContent/${sectionID}/content/${id}`}
                  data={{ title: title, description: description, id: id, order: order }}
               />
            ) : null}
         </Box>
      </Box>
   );
}

export function PitchCardsComponent(props: SectionProps): JSX.Element {
   const { data } = props;
   const { sectionName, sectionID, sectionOrder, createdAt, updatedAt } = data;
   const content = data.content as DBPitchCardKey;
   const pitchCardsDB = content.items;

   const [adminEditor, setadminEditor] = useState(props.adminEditor);
   const [title, setTitle] = useState(content.title);

   const handlePitchCardSectionTitleChange = (event: any) => {
      let text: string = event.target.value;
      setTitle(text);
   };

   let pitchCardsContent: JSX.Element[] = [];

   // Sort the pitchCards array based on the "order" property
   if (pitchCardsDB) {
      if (pitchCardsDB.title) delete pitchCardsDB.title;
      let pitchCards: DBHomePageContentPitchCards[] = Object.values(pitchCardsDB as any);
      if (pitchCards) {
         pitchCards.sort((a, b) => a.order - b.order);

         for (let i = 0; i < pitchCards.length; i++) {
            pitchCardsContent.push(
               <OnePitchCard
                  id={pitchCards[i].id}
                  sectionName={sectionName}
                  sectionID={sectionID}
                  adminEditor={adminEditor}
                  order={pitchCards[i].order}
                  img={pitchCards[i].image ? (pitchCards[i].image as string) : ({ speakerImgExample1 } as unknown as string)}
                  initTitle={pitchCards[i].title ? (pitchCards[i].title as string) : 'Example title'}
                  initDescription={pitchCards[i].description ? (pitchCards[i].description as string) : 'Example description'}
                  key={i}
               />
            );
         }
      }
      return (
         <>
            {adminEditor ? (
               <Divider>
                  <h2>Edit pitchcards</h2>
               </Divider>
            ) : null}
            {adminEditor ? (
               <EditText
                  onChange={handlePitchCardSectionTitleChange}
                  initText={title ? title : '<h2>Example title of pitchCards</h2>'}
               />
            ) : (
               <h1>{title}</h1>
            )}
            {adminEditor ? (
               <SaveTextsButton refBelowWebsiteID={`homepageContent/${sectionID}/content/`} data={{ title: title }} />
            ) : null}
            <Box className="wrapperOfImagesWithPitch">
               {pitchCardsContent}
               {/* Below is to always make it available to add one more pitchCards */}
               {adminEditor ? (
                  <OnePitchCard
                     adminEditor={adminEditor}
                     sectionName={sectionName}
                     sectionID={sectionID}
                     newCard={true}
                     order={pitchCardsContent.length + 1}
                     img={''}
                     initTitle={''}
                     initDescription={''}
                  />
               ) : null}
            </Box>
         </>
      );
   } else {
      return (
         <Box className="wrapperOfImagesWithPitch">
            <OnePitchCard
               adminEditor={adminEditor}
               sectionName={sectionName}
               sectionID={sectionID}
               order={1}
               img={visningsbild1}
               initTitle={'About Rotary'}
               initDescription={
                  "Rotary is a global network of 1.2 million neighbors, friends, leaders, and problem-solvers who see a world where people unite and take action to create lasting change – across the globe, in our communities, and in ourselves. Solving real problems takes real commitment and vision. For more than 110 years, Rotary's people of action have used their passion, energy, and intelligence to take action on sustainable projects. From literacy and peace to water and health, we are always working to better our world, and we stay committed to the end. Read more at <a href='https://www.rotary.org/en'>Rotary.org</a>."
               }
            />
            <OnePitchCard
               adminEditor={adminEditor}
               sectionName={sectionName}
               sectionID={sectionID}
               order={2}
               img={visningsbild2}
               initTitle={'Stockholm City Affärsnätverk'}
               initDescription={
                  'Rotaryklubbar består av Rotarianer som träffas generellt en gång i veckan för ett frukost-, lunch- eller middagsmöte. Affärsnätverket i Stockholm City är ett samarbete där 10 olika klubbar gått samman för att träffas med ett större fokus på att främja nätverket som finns för att hjälpa dagens yrkesverksamma att lyckas i karriären genom goda värderingar och värdefulla kontakter. Vi inspirerar, utbildar och uppdaterar också våra Rotarianer med spännande föreläsare i samband med lunchträffarna.'
               }
            />
            <OnePitchCard
               adminEditor={adminEditor}
               sectionName={sectionName}
               sectionID={sectionID}
               order={3}
               img={visningsbild3}
               initTitle={'Hur går jag med i Rotary?'}
               initDescription={
                  'När du följt med som gäst några gånger till en kontakt som bjudit in dig kanske du börjar fundera på om du vill gå med i Rotary? Då får du gärna besöka olika Rotaryklubbar, förslagsvis någon av oss 10 som arrangerar detta affärsnätverk. Man blir medlem genom att skicka in en ansökan till klubben man vill gå med i men man måste även i varje klubb vara gäst för att få komma. Det rekommenderas att man går flera gånger som gäst på samma klubb så att Rotarianerna får en bra känsla av vem gästen är innan en ansökan inkommer. Annars finns risk att det blir avslag på ansökan.'
               }
            />
         </Box>
      );
   }
}
