import React from 'react';
import rotaryLogo from '../assets/Logga stockholm city affarsnatverk 2020-12-28.png';
import rotaryVideomp4 from '../assets/VideoStockholmCityAffarsnatverk_Trim_min.mp4';
import rotaryVideoWebm from '../assets/VideoStockholmCityAffarsnatverk_Trim_min.webm';
import arrowDown from '../assets/baseline_keyboard_arrow_down_white_18dp.png';
import { DBWebsiteHomePageContentButton, StandardWebPageContentHeader } from './utilsAndInterfaces/interfaces';
import { RegisterButtonComponent } from './RegisterButton';
import { Box, Divider, Button } from '@mui/material';
import { ref, uploadBytes } from 'firebase/storage';
import { ref as dbRef, update } from 'firebase/database';
import { db, devSettings, storage } from './utilsAndInterfaces/firebase';
import { WEBSITE_ID } from '../App';

export function HeaderLogoUpload(): JSX.Element {
   function handleChange(event: any) {
      //setFile(event.target.files[0])
      const pitchCardRef = ref(storage, `websites/${WEBSITE_ID}/homepageContent/pitchCards/logo`);

      // 'file' comes from the Blob or File API
      uploadBytes(pitchCardRef, event.target.files[0]).then((snapshot) => {
         console.log('Uploaded a blob or file!');
         console.log('snapshot.ref.fullPath', snapshot.ref.fullPath);
         let startURL = devSettings === 'PRODUCTION' ? `gs://` : `http://127.0.0.1:9199/v0/b/`;
         //http://127.0.0.1:9199/v0/b/stockholm-city-affarsnatverk.appspot.com/o/websites%2F-N_r3h15dd1OQXZWLKfT%2FhomepageContent%2FpitchCards%2F-N_r9mmYWHD0KBuSellp?alt=media&token=a874d060-2012-488e-ab23-8de5239b722c
         update(dbRef(db, `/websites/${WEBSITE_ID}/homepageContent/header/`), {
            logo: `${startURL}${storage.app.options.storageBucket}/o/${encodeURIComponent(
               snapshot.ref.fullPath
            )}?alt=media&token=${snapshot.metadata.downloadTokens}`, //pitchCardRef.fullPath, // url to storage
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

export function EditHeaderComponent(): JSX.Element {
   return (
      <>
         <Divider>
            <h2>Edit Header</h2>
         </Divider>
         <Divider>
            <h3>Edit Header Logo</h3>
         </Divider>
         <Divider>
            <h3>Edit Header Video</h3>
         </Divider>
      </>
   );
}

export function HeaderComponent({
   adminEditor,
   header,
}: {
   adminEditor?: true;
   header: StandardWebPageContentHeader;
}): JSX.Element {
   let logo = header?.logo ? header.logo : rotaryLogo;
   let video = header?.video ? header.video : rotaryVideomp4;
   let image = header?.image ? header.image : null;
   let videoOrImage = video ? video : image ? image : null;
   let headerTitle = header?.title ? header.title : 'Stockholm City Affärsnätverk';
   let headerDescription = header?.description
      ? header.description
      : 'Lär känna techbranschens ledare och nyckelpersoner. En katalysator för ert företags tillväxt och lönsamhet.';
   let time = header?.time ? header.time : 'ONS 6 SEP KL.18.00 - 21.00';
   let location = header?.location ? header.location : 'M / S VINDHEM, SKEPPSBRON - KAJPLATS 101';
   let headerContent: JSX.Element = <></>;

   let videoExtension =
      video && typeof video === 'string'
         ? video
              .split('.')
              .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
              .slice(1)
              .join('.')
         : 'mp4';

   if (videoOrImage === video && video !== null) {
      headerContent = (
         <>
            <video autoPlay muted loop className="video-container">
               <source src={video} type={`video/mp4`} />
               {/*<source src={rotaryVideoWebm} type="video/webm" />*/}
               Your browser does not support the video tag.
            </video>
         </>
      );
   } else if (videoOrImage === image && image !== null) {
      headerContent = <img className="top-image" src={image} alt="headerImage"></img>;
   } else {
      console.log('Header - no img nor video');
   }

   return (
      <>
         {adminEditor ? <HeaderLogoUpload /> : <img id="header-logo" src={logo} alt="headerImage" />}
         <div className="header-container">
            <div className="black-layer">{headerContent}</div>
            {/* Content on top of the screen over the video or image */}
            <div className="box-text-over-video">
               <h1 className="text-over-video">{headerTitle}</h1>
               <h3 className="text-over-video">{headerDescription}</h3>
               {/*<h2 class="text-over-video">VI AVVAKTAR DATUM &#8226; ANMÄL DIG OCH FÅ VIP-INBJUDAN</h2> */}
               <h2 className="text-over-video">
                  {time} &#8226; {location}
               </h2>
               <p>
                  <img className="move-arrow" src={arrowDown}></img>
               </p>
            </div>
         </div>

         <div className="text-under-video">
            <h3>{headerDescription}</h3>
            <h2>
               {time} &#8226; {location}
            </h2>
            {/*<h2>VI AVVAKTAR DATUM &#8226; ANMÄL DIG OCH FÅ VIP-INBJUDAN</h2>*/}
         </div>
         {/* this will not work, the code below loaded the img before this was a editable component
            <img id="header-logo" alt="headerlogo" src={logo} />
            {headerContent}
    */}
      </>
   );
}
