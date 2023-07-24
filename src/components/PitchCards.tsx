import visningsbild1 from '../assets/DSC01125.JPG';
import visningsbild2 from '../assets/DSC01286.JPG';
import visningsbild3 from '../assets/DSC02755.JPG';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import react, { useState } from 'react';
import { DBWebsiteHomePageContentPitchCards, DBWebsitePitchCardKey } from './utilsAndInterfaces/interfaces';
import { Box, Button, Divider, Stack, SvgIcon, TextField } from '@mui/material';
import { deleteObject, getStorage, ref, uploadBytes } from 'firebase/storage';
import { db, devSettings, storage } from './utilsAndInterfaces/firebase';
import { child, push, ref as dbRef, set, update, onChildAdded } from 'firebase/database';
import { WEBSITE_ID } from '../App';

export function OnePitchCard({
   adminEditor,
   img,
   order,
   initTitle,
   initDescription,
   newCard,
   id,
}: {
   adminEditor?: boolean;
   img: string;
   order: number;
   initTitle: string;
   initDescription: string;
   newCard?: true;
   id?: string;
}): JSX.Element {
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

   const handleSaveTexts = () => {
      // Perform your save logic here, e.g., make an API call to save the data
      console.log('Saving texts to db');
      console.log('id: ' + id);
      console.log('title: ' + title);
      console.log('description: ' + description);
      update(dbRef(db, `websites/${WEBSITE_ID}/homepageContent/pitchCards/${id}`), {
         title: title,
         description: description,
         id: id,
         order: order,
      });

      console.log('Saved title and description');
   };

   const removePitchCard = (id: string, imgStorageRef: string) => {
      return () => {
         //Remove from db
         const pitchCardsRef = dbRef(db, `websites/${WEBSITE_ID}/homepageContent/pitchCards/${id}`);
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
      <div className="pitchcard-container" id={id}>
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

            {newCard ? (
               <Box
                  minHeight="10rem"
                  sx={{
                     opacity: '50%',
                     textAlign: 'center',
                     width: '100%',
                     backgroundColor: 'grey',
                  }}
               >
                  <SvgIcon component={AddPhotoAlternateIcon} fontSize="large" />
               </Box>
            ) : (
               <img className="visningsbilder" alt="visningsbild1" src={img} />
            )}
            {adminEditor ? <PitchCardFileUpload cardOrderNr={order} /> : null}
            {adminEditor ? <EditPitchardTitle onChange={handleTitleChange} initText={title} /> : <h1>{title}</h1>}
            {adminEditor ? (
               <EditPitchardDescription onChange={handleDescriptionChange} initText={description} />
            ) : (
               <p>{description}</p>
            )}
            {adminEditor ? <SaveTextsButton onSave={handleSaveTexts} /> : null}
         </Box>
      </div>
   );
}

export function PitchCardsComponent({
   pitchCardsDB,
   adminEdit,
}: {
   pitchCardsDB: DBWebsitePitchCardKey;
   adminEdit?: boolean;
}): JSX.Element {
   const [adminEditor, setadminEditor] = useState(adminEdit);

   let pitchCardsContent: JSX.Element[] = [];

   // Sort the pitchCards array based on the "order" property
   if (pitchCardsDB) {
      let pitchCards: DBWebsiteHomePageContentPitchCards[] = Object.values(pitchCardsDB);
      pitchCards.sort((a, b) => a.order - b.order);

      for (let i = 0; i < pitchCards.length; i++) {
         pitchCardsContent.push(
            <OnePitchCard
               id={pitchCards[i].id}
               adminEditor={adminEditor}
               order={pitchCards[i].order}
               img={pitchCards[i].image}
               initTitle={pitchCards[i].title}
               initDescription={pitchCards[i].description}
            />
         );
      }

      return (
         <>
            <Divider>
               <h2>Edit pitchcards</h2>
            </Divider>
            <Box className="wrapperOfImagesWithPitch">
               {pitchCardsContent}
               {/* Below is to always make it available to add one more pitchCards */}
               {adminEditor ? (
                  <OnePitchCard
                     adminEditor={adminEditor}
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
               order={1}
               img={visningsbild1}
               initTitle={'About Rotary'}
               initDescription={
                  "Rotary is a global network of 1.2 million neighbors, friends, leaders, and problem-solvers who see a world where people unite and take action to create lasting change – across the globe, in our communities, and in ourselves. Solving real problems takes real commitment and vision. For more than 110 years, Rotary's people of action have used their passion, energy, and intelligence to take action on sustainable projects. From literacy and peace to water and health, we are always working to better our world, and we stay committed to the end. Read more at <a href='https://www.rotary.org/en'>Rotary.org</a>."
               }
            />
            <OnePitchCard
               adminEditor={adminEditor}
               order={2}
               img={visningsbild2}
               initTitle={'Stockholm City Affärsnätverk'}
               initDescription={
                  'Rotaryklubbar består av Rotarianer som träffas generellt en gång i veckan för ett frukost-, lunch- eller middagsmöte. Affärsnätverket i Stockholm City är ett samarbete där 10 olika klubbar gått samman för att träffas med ett större fokus på att främja nätverket som finns för att hjälpa dagens yrkesverksamma att lyckas i karriären genom goda värderingar och värdefulla kontakter. Vi inspirerar, utbildar och uppdaterar också våra Rotarianer med spännande föreläsare i samband med lunchträffarna.'
               }
            />
            <OnePitchCard
               adminEditor={adminEditor}
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

export function PitchCardFileUpload({ cardOrderNr }: { cardOrderNr: number }): JSX.Element {
   const [file, setFile] = useState();
   function handleChange(event: any) {
      //setFile(event.target.files[0])
      let randomkey = push(child(dbRef(db), `websites/${WEBSITE_ID}/homepageContent/pitchCards/`)).key;
      const pitchCardRef = ref(storage, `websites/${WEBSITE_ID}/homepageContent/pitchCards/${randomkey}`);
      console.log('storage.app.options.storageBucket', storage.app.options.storageBucket);
      console.log('storage.app.options.databaseURL', storage.app.options.databaseURL);
      console.log('storage.app.options.storageBucket', storage.app.options.storageBucket);

      // 'file' comes from the Blob or File API
      uploadBytes(pitchCardRef, event.target.files[0]).then((snapshot) => {
         console.log('Uploaded a blob or file!');
         console.log('snapshot.ref.fullPath', snapshot.ref.fullPath);
         let startURL = devSettings === 'PRODUCTION' ? `gs://` : `http://127.0.0.1:9199/v0/b/`;
         //http://127.0.0.1:9199/v0/b/stockholm-city-affarsnatverk.appspot.com/o/websites%2F-N_r3h15dd1OQXZWLKfT%2FhomepageContent%2FpitchCards%2F-N_r9mmYWHD0KBuSellp?alt=media&token=a874d060-2012-488e-ab23-8de5239b722c
         update(dbRef(db, `/websites/${WEBSITE_ID}/homepageContent/pitchCards/` + randomkey), {
            image: `${startURL}${storage.app.options.storageBucket}/o/${encodeURIComponent(
               snapshot.ref.fullPath
            )}?alt=media&token=${snapshot.metadata.downloadTokens}`, //pitchCardRef.fullPath, // url to storage
            //title: string;
            //description: string;
            id: randomkey,
            order: cardOrderNr,
         });
      });
   }
   return (
      <Box>
         <Button className="uploadImageButton" variant="contained" component="label">
            Upload new image
            <input hidden accept="image/*" type="file" onChange={handleChange} />
         </Button>
      </Box>
   );
}

export function EditPitchardTitle({ initText, onChange }: { initText: string; onChange: any }): JSX.Element {
   return (
      <Box style={{ paddingBottom: '2rem', width: '100%' }}>
         <TextField
            id="outlined-textarea"
            label="Header"
            placeholder="Placeholder"
            multiline
            defaultValue={initText}
            style={{ width: '100%' }}
            InputLabelProps={{ shrink: true }}
            onChange={onChange}
         />
      </Box>
   );
}

export function EditPitchardDescription({ initText, onChange }: { initText: string; onChange: any }): JSX.Element {
   return (
      <Box style={{ paddingBottom: '2rem', width: '100%' }}>
         <TextField
            id="outlined-multiline-static"
            label="Text content"
            multiline
            rows={10}
            defaultValue={initText}
            style={{ width: '100%' }}
            InputLabelProps={{ shrink: true }}
            onChange={onChange}
         />
      </Box>
   );
}

export function SaveTextsButton({ onSave }: { onSave: any }): JSX.Element {
   return (
      <Box style={{ paddingBottom: '2rem', textAlign: 'center', width: '100%' }}>
         <Button onClick={onSave} variant="contained" color="primary">
            Save texts
         </Button>
      </Box>
   );
}
