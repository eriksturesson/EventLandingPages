import { BackendError } from 'backend-error';
import { db } from '../firebaseSettings';
import { InvitedAdmin } from '../interfaces/dbInterfaces';

export async function getAdminInvitationService(websiteID: string): Promise<InvitedAdmin[]> {
   const invitationsRef = db.ref(`invitedAdmins/${websiteID}`);
   const snapshot = await invitationsRef.once('value');
   const invitationsRaw = snapshot.val();

   if (!invitationsRaw) {
      console.log(`No invited admins found for website ${websiteID}`);
      return [];
   }

   const invitations: Record<string, InvitedAdmin> = invitationsRaw;
   if (!invitations || Object.keys(invitations).length === 0) {
      console.log(`No invitations found for website ${websiteID}`);
      return [];
   }
   const invitationsArray: InvitedAdmin[] = Object.values(invitations);

   return invitationsArray;
}
