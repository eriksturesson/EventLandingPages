import { readAndWriteToFirebase } from '../utils/firebaseFunctions';

export const removeInvite = async (websiteID: string, inviteID: string) => {
   try {
      await readAndWriteToFirebase({
         method: 'remove',
         ref: `invitedAdmins/${websiteID}/${inviteID}`,
      });
      console.log(`Invitation ${inviteID} removed`);
   } catch (error) {
      console.error('Error removing admin:', error);
   }
};
