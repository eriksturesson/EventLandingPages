import React, { useState } from 'react';
import { HeadingSectionTypes } from '../interfaces/dbInterfaces';
import { SectionProps } from '../interfaces/sectionInterfaces';
import { Stack, Typography, Select, MenuItem } from '@mui/material';
import { EditText, SaveTextsButton } from '../smallComponents/TextEdits';

function HeadingSection(props: SectionProps): JSX.Element {
   const { adminEditor, data } = props;
   const { sectionID, content } = data;
   const { text: textInit, size: sizeInit } = content as HeadingSectionTypes;
   const [text, setText] = useState(textInit);
   const [size, setSize] = useState(sizeInit);

   const refBelowWebsiteID = `homepageContent/${sectionID}/content/`;

   // ts complains if not defined like this but I can't find another way
   const headingSize = ('h' + size) as 'h2';

   return (
      <Stack component="section" alignItems="center" justifyContent="space-between">
         <Typography variant={headingSize}>{text}</Typography>
         {adminEditor && (
            <Stack
               spacing={2}
               direction="row"
               justifyContent="center"
               sx={{
                  width: '100%',
                  height: '4em',
                  backgroundColor: 'lightblue',
                  padding: '1em',
                  borderBottom: '2px solid blue',
               }}
            >
               <EditText
                  initText={text}
                  onChange={(event: any) => {
                     setText(event.target.value);
                  }}
                  labelName="Edit heading"
               />
               <Select
                  value={size}
                  label="Heading size"
                  onChange={(event: any) => {
                     setSize(event.target.value);
                  }}
                  sx={{ minWidth: 120 }}
               >
                  <MenuItem value={2}>Large</MenuItem>
                  <MenuItem value={3}>Medium</MenuItem>
                  <MenuItem value={4}>Small</MenuItem>
               </Select>
               <SaveTextsButton refBelowWebsiteID={refBelowWebsiteID} data={{ text, size }} />
            </Stack>
         )}
      </Stack>
   );
}

export default HeadingSection;
