import React, { useEffect, useState } from 'react';

import { getDatabase, ref, set, onValue, child, get } from 'firebase/database';
import { db } from './utils/firebase';
import { DBFullScreenMedia, DBHomePageContent, DBSpeaker, DBSpeakersKey } from './interfaces/dbInterfaces';
import { SectionIDs } from './interfaces/sectionInterfaces';
import { SectionLoader } from '../SectionLoader';
import { initialState } from './utils/initData';
import { LoadingSpinner } from './Loading';
import { SomethingWentWrong } from './SomethingWentWrong';
import { Box, Typography } from '@mui/material';

function testonload() {
   alert('testar onload i html-filen, då ska denna funktion köras');
}

const Home = ({ homepageContent }: { homepageContent: SectionIDs }): JSX.Element => {
   return <SectionLoader adminEditor={false} data={homepageContent} />;
};

export default Home;
