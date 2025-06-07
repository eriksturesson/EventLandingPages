import DeleteIcon from '@mui/icons-material/Delete';
import { Box, CardMedia, Grid, SvgIcon } from '@mui/material';
import { ref as dbRef, set } from 'firebase/database';
import { deleteObject, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDbContent } from '../../contexts/DBContentContext';
import { DBOrganizersKey, OrganizerObject } from '../../interfaces/dbInterfaces';
import { SectionProps, SectionTypes } from '../../interfaces/sectionInterfaces';
import { db, storage } from '../../utils/firebase';
import { EditorOfImage } from '../smallComponents/FileUploads';
export function OneOrganizer({
   organizer,
   id,
   sectionID,
   sectionName,
   adminEditor,
   pageID,
   onRemove,
}: {
   organizer: OrganizerObject;
   sectionID: string;
   id: string;
   sectionName: SectionTypes;
   adminEditor: boolean;
   pageID: string | null;
   onRemove: (id: string, imgStorageRef: string) => void;
}): JSX.Element {
   return adminEditor ? (
      <>
         <Box>
            <SvgIcon
               onClick={() => onRemove(id, organizer.image as string)}
               sx={{ color: 'red', cursor: 'pointer' }}
               component={DeleteIcon}
               fontSize="large"
            />
         </Box>
         <EditorOfImage
            sectionID={sectionID}
            order={organizer.order}
            sectionName={sectionName}
            image={organizer.image}
            id={id}
            pageID={pageID}
         />
      </>
   ) : (
      <CardMedia component="img" image={organizer?.image} alt="Organizer logo" />
   );
}

export function OrganizersComponent(props: SectionProps): JSX.Element {
   const { data, adminEditor, pageID } = props;
   const { websiteID } = useDbContent();
   const content = data.content as DBOrganizersKey | undefined;
   const { sectionName, sectionID } = data;

   const [organizers, setOrganizers] = useState<OrganizerObject[]>([]);
   useEffect(() => {
      if (content) {
         const parsed = Object.entries(content).map(([id, organizer]) => ({
            id,
            image: organizer.image || '',
            order: organizer.order || 0,
         }));
         setOrganizers(parsed);
      }
   }, [content]);

   const handleRemove = (id: string, imgStorageRef: string) => {
      const path = pageID
         ? `customPages/${pageID}/content/${sectionID}/content/${id}`
         : `homepageContent/${sectionID}/content/${id}`;

      const dbPath = dbRef(db, `websites/${websiteID}/${path}`);
      set(dbPath, null);
      if (imgStorageRef) {
         const imgRef = ref(storage, imgStorageRef);
         deleteObject(imgRef).catch(console.error);
      }
      setOrganizers((prev) => prev.filter((o) => o.id !== id));
   };

   const sortedOrganizers = organizers.sort((a, b) => a.order - b.order);
   const count = sortedOrganizers.length;

   function getGridSize() {
      if (count === 1) return 12;
      if (count === 2) return 6;
      if (count === 3) return 4;
      return 3;
   }
   const gridSize = getGridSize();

   const newOrganizer: OrganizerObject = {
      id: uuidv4(),
      order: organizers.length + 1,
      image: '',
   };

   return (
      <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ py: 4 }}>
         {sortedOrganizers.map((organizer) => (
            <Grid item xs={12} sm={gridSize} key={organizer.id} sx={{ textAlign: 'center' }}>
               {adminEditor ? (
                  <Box
                     sx={{
                        overflow: 'hidden',
                     }}
                  >
                     <OneOrganizer
                        organizer={organizer}
                        id={organizer.id}
                        sectionID={sectionID}
                        sectionName={sectionName}
                        adminEditor={adminEditor}
                        onRemove={handleRemove}
                        pageID={pageID}
                     />
                  </Box>
               ) : (
                  <Box
                     sx={{
                        maxWidth: 350,
                        margin: 'auto',
                     }}
                  >
                     <OneOrganizer
                        organizer={organizer}
                        id={organizer.id}
                        sectionID={sectionID}
                        sectionName={sectionName}
                        adminEditor={adminEditor}
                        onRemove={handleRemove}
                        pageID={pageID}
                     />
                  </Box>
               )}
            </Grid>
         ))}

         {adminEditor && (
            <Grid item xs={12} sm={gridSize} key="new-organizer">
               <Box>
                  <OneOrganizer
                     organizer={newOrganizer}
                     id={newOrganizer.id}
                     sectionID={sectionID}
                     sectionName={sectionName}
                     adminEditor={adminEditor}
                     onRemove={handleRemove}
                     pageID={pageID}
                  />
               </Box>
            </Grid>
         )}
      </Grid>
   );
}
