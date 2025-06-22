import { readAndWriteToFirebase } from '../utils/firebaseFunctions';

export const removeAdmin = async (websiteID: string, uid: string) => {
   try {
      await readAndWriteToFirebase({
         method: 'remove',
         ref: `admins/${websiteID}/${uid}`,
      });
      console.log(`Admin ${uid} removed`);
   } catch (error) {
      console.error('Error removing admin:', error);
   }
};
