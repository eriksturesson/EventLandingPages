import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Tooltip } from '@mui/material';
import { useDbContent } from '../../contexts/DBContentContext';
import { readAndWriteToFirebase } from '../../utils/firebaseFunctions';

interface RemoveSectionComponentProps {
   pageID: string | null; // null if homepage section
   sectionID: string;
   sectionName: string;
}

export function RemoveSectionComponent({ pageID, sectionID, sectionName }: RemoveSectionComponentProps): JSX.Element {
   const { websiteID } = useDbContent();

   const handleDelete = () => {
      const path = pageID
         ? `websites/${websiteID}/customPages/${pageID}/content/${sectionID}`
         : `websites/${websiteID}/homepageContent/${sectionID}`;

      readAndWriteToFirebase({ ref: path, method: 'remove' }); // delete section
   };

   return (
      <Tooltip title={`Remove section: ${sectionName}`}>
         <Button sx={{ mt: 2, mb: 2 }} variant="contained" startIcon={<DeleteIcon />} color="error" onClick={handleDelete}>
            Remove {sectionName} section
         </Button>
      </Tooltip>
   );
}
