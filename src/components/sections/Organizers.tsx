import DeleteIcon from '@mui/icons-material/Delete';
import { Box, SvgIcon } from '@mui/material';
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
         <Box
            sx={{
               marginTop: '1rem',
               backgroundColor: 'grey',
               textAlign: 'center',
               width: '100%',
               display: 'flex',
               alignItems: 'center',
            }}
         >
            <SvgIcon
               style={{ color: 'red', cursor: 'pointer' }}
               onClick={() => onRemove(id, organizer.image as string)}
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
      <Box>
         <img className="organizer-logo" src={organizer?.image} />
      </Box>
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
      set(dbPath, null); // delete from database
      if (imgStorageRef) {
         const imgRef = ref(storage, imgStorageRef);
         deleteObject(imgRef).catch(console.error); // delete from storage
      }
      setOrganizers((prev) => prev.filter((organizer) => organizer.id !== id));
   };
   const newOrganizer: OrganizerObject = {
      id: uuidv4(),
      order: organizers.length + 1,
      image: '',
   };
   return (
      <>
         {organizers &&
            Object.values(organizers)
               .sort((a, b) => a.order - b.order)
               .map((organizer) => (
                  <OneOrganizer
                     organizer={organizer}
                     key={organizer.id}
                     id={organizer.id}
                     sectionID={sectionID}
                     sectionName={sectionName}
                     adminEditor={adminEditor}
                     onRemove={handleRemove}
                     pageID={pageID}
                  />
               ))}

         {adminEditor && (
            <OneOrganizer
               organizer={newOrganizer}
               key={newOrganizer.id}
               id={newOrganizer.id}
               sectionID={sectionID}
               sectionName={sectionName}
               adminEditor={adminEditor}
               onRemove={handleRemove}
               pageID={pageID}
            />
         )}
      </>
   );
}
