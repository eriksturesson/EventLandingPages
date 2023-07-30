import React from 'react';
import rotaryLogo from '../../assets/Logga stockholm city affarsnatverk 2020-12-28.png';
import rotaryVideomp4 from '../../assets/VideoStockholmCityAffarsnatverk_Trim_min.mp4';
import rotaryVideoWebm from '../../assets/VideoStockholmCityAffarsnatverk_Trim_min.webm';
import arrowDown from '../../assets/baseline_keyboard_arrow_down_white_18dp.png';
import {
   DBFullScreenMedia,
   DBHomePageContentButton,

   // StandardWebPageContentHeader,
} from '../interfaces/dbInterfaces';
import { SectionContent, SectionProps, SectionTypes } from '../interfaces/sectionInterfaces';
import { RegisterButtonComponent } from './CallToActionButton';
import { Box, Divider, Button } from '@mui/material';
import { ref, uploadBytes } from 'firebase/storage';
import { ref as dbRef, update } from 'firebase/database';
import { db, devSettings, storage } from '../utils/firebase';
import { WEBSITE_ID } from '../../App';
import { ImageCardFileUpload } from '../smallComponents/FileUploads';

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

export function HeaderComponent(props: SectionProps): JSX.Element {
   const { adminEditor, data } = props;
   const { sectionName, sectionID, sectionOrder, createdAt, updatedAt } = data;

   const content = data.content as DBFullScreenMedia;

   let logo = content?.logo ? content.logo : rotaryLogo;
   let video = content?.video ? content.video : rotaryVideomp4;
   let image = content?.image ? content.image : null;
   let videoOrImage = video ? video : image ? image : null;
   let headerTitle = content?.title ? content.title : 'Stockholm City Affärsnätverk';
   let headerDescription = content?.description
      ? content.description
      : 'Lär känna techbranschens ledare och nyckelpersoner. En katalysator för ert företags tillväxt och lönsamhet.';
   let time = content?.time ? content.time : 'ONS 6 SEP KL.18.00 - 21.00';
   let location = content?.location ? content.location : 'M / S VINDHEM, SKEPPSBRON - KAJPLATS 101';
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
      <Box>
         {adminEditor ? (
            <Divider>
               <h1>Edit Header img/video and logo</h1>
            </Divider>
         ) : null}
         {adminEditor ? (
            <Divider>
               <h2>Edit Logo</h2>
            </Divider>
         ) : null}
         <img id="header-logo" src={logo} alt="headerImage" />
         {adminEditor ? <ImageCardFileUpload cardOrderNr={1} sectionID={sectionID} sectionName={'fullScreenMedia'} /> : null}
         {adminEditor ? (
            <Divider>
               <h2>Edit img/video</h2>
            </Divider>
         ) : null}
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
      </Box>
   );
}
