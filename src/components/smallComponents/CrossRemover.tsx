import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/material';
export function CrossRemover({
   id,
   image,
   onRemove,
   topRightOrCenter = 'top-right',
}: {
   id: string;
   image?: string;
   topRightOrCenter: 'top-right' | 'center';
   onRemove: (id: string, imgStorageRef: string) => void;
}): JSX.Element {
   const boxSx: any =
      topRightOrCenter === 'top-right'
         ? { float: 'right', marginRight: '1rem' }
         : { textAlign: 'center', position: 'relative' };

   return (
      <Box sx={boxSx}>
         <CloseIcon
            fontSize="large"
            style={{ color: 'red', cursor: 'pointer' }}
            onClick={() => onRemove(id, image as string)}
         />
      </Box>
   );
}
