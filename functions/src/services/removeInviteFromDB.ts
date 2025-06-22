import { BackendError } from 'backend-error';
import { db } from '../firebaseSettings';

export async function removeInviteFromDB({ websiteID, inviteID }: { websiteID: string; inviteID: string }): Promise<void> {
   if (!websiteID || !inviteID) {
      throw BackendError.UnprocessableEntity('Website ID and Invite ID are required');
   }
   try {
      const inviteRef = db.ref(`invitedAdmins/${websiteID}/${inviteID}`);
      await inviteRef.remove();
      console.log(`Invite ${inviteID} removed from website ${websiteID}`);
   } catch (error) {
      console.error(`Error removing invite ${inviteID} from website ${websiteID}:`, error);
      throw BackendError.Internal(`Failed to remove invite: ${inviteID} from website: ${websiteID}`);
   }
}
