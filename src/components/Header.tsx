import React from "react";
import rotaryLogo from '../assets/Logga stockholm city affarsnatverk 2020-12-28.png';
import rotaryVideomp4 from '../assets/VideoStockholmCityAffarsnatverk_Trim_min.mp4';
import rotaryVideoWebm from '../assets/VideoStockholmCityAffarsnatverk_Trim_min.webm';
import { StandardWebPageContentHeader } from "./utilsAndInterfaces/interfaces";

export function HeaderComponent({ header }: { header: StandardWebPageContentHeader }): JSX.Element {
    let logo = header?.logo ? header.logo : rotaryLogo
    let video = header?.video ? header.video : null
    let image = header?.image ? header.image : null
    let videoOrImage = video ? video : image ? image : null
    let headerContent: JSX.Element = <></>

    let videoExtension = video && typeof video === 'string' ? video
        .split('.')
        .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
        .slice(1)
        .join('.') : 'mp4'

    if (videoOrImage === video && video !== null) {
        headerContent = <><video autoPlay muted loop id="myVideo">
            <source src={video} type={`video/${videoExtension}`} />
            {/*<source src={rotaryVideoWebm} type="video/webm" />*/}
            Your browser does not support the video tag.
        </video></>
    } else if (videoOrImage === image && image !== null) {
        headerContent = <img src={image} alt="headerImage"></img>
    } else {
        <source src={rotaryVideomp4} type={`video/${videoExtension}`} />
    }

    return (
        <>
            <img id="header-logo" alt="headerlogo" src={logo} />
            {headerContent}
        </>
    )
}