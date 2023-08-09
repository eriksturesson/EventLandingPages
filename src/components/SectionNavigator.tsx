import React from 'react';
import { Paper, Grid } from '@mui/material';
import { SectionContent } from './interfaces/sectionInterfaces';

type Props = {
   sections: SectionContent[];
};

function SectionNavigator(props: Props): JSX.Element {
   const { sections } = props;

   // const refBelowWebsiteID = `homepageContent/${sectionID}/content/`;

   // ts complains if not defined like this but I can't find another way

   return (
      <Grid item xs={3} sx={{ display: 'flex', flexDirection: 'column', gap: '2em', padding: '2em', textAlign: 'center' }}>
         {sections.map((section, i) => {
            return (
               <Paper key={i} data-id={section.sectionID} sx={{ padding: '1em' }}>
                  {section.sectionName}
               </Paper>
            );
         })}
      </Grid>
   );
}

export default SectionNavigator;
