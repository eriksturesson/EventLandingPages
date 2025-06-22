import { BackendError } from 'backend-error';
import { db } from '../firebaseSettings';
import { InvitedAdmin } from '../interfaces/dbInterfaces';

export async function getAdminInvitationService(websiteID: string): Promise<InvitedAdmin[]> {
   const invitationsRef = db.ref(`invitedAdmins/${websiteID}`);
   const snapshot = await invitationsRef.once('value');
   const invitationsRaw = snapshot.val();

   if (!invitationsRaw) {
      throw BackendError.NotFound(`No invitations found for website ${websiteID}`);
   }

   const invitations: Record<string, InvitedAdmin> = invitationsRaw;
   if (!invitations || Object.keys(invitations).length === 0) {
      throw BackendError.NotFound(`No invitations found for website ${websiteID}`);
   }
   const invitationsArray: InvitedAdmin[] = Object.values(invitations);

   return invitationsArray;
}
