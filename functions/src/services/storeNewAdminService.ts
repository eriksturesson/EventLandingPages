import { BackendError } from 'backend-error';
import { db } from '../firebaseSettings';
import { DBAdminUser, InvitedAdmin } from '../interfaces/dbInterfaces';

export async function storeNewAdminService({
   websiteID,
   userID,
   email,
   inviteID,
}: {
   websiteID: string;
   userID: string;
   email: string;
   inviteID: string;
}): Promise<string> {
   //Get invitedObject so we know more about the invite
   const invitedRef = db.ref(`invitedAdmins/${websiteID}/${inviteID}`);
   const inviteObjectSnap = await invitedRef.get();
   const inviteData: InvitedAdmin = inviteObjectSnap.val();
   if (!inviteData) throw BackendError.NotFound(`No invite found with ID ${inviteID} for website ${websiteID}`);
   const {
      invitedByEmail,
      invitedByUserID,
      invitedAt,
      role,
      websiteID: websiteIDFromInvite,
      accepted,
      email: emailFromInvite,
   } = inviteData;
   if (accepted) throw BackendError.Forbidden(`Invite with ID ${inviteID} has already been used`);
   if (websiteIDFromInvite !== websiteID)
      throw BackendError.BadRequest(`Invite with ID ${inviteID} is not valid for website ${websiteID}`);
   if (emailFromInvite.toLowerCase() !== email.toLowerCase())
      throw BackendError.BadRequest(`Invite with ID ${inviteID} is not valid for email ${email}`);

   const newAdmin: DBAdminUser = {
      id: userID,
      inviteID: inviteID,
      email: email,
      invitedAt,
      invitedByEmail,
      invitedByUserID,
      active: true,
      role: role,
   };

   const adminRef = db.ref(`admins/${websiteID}/${userID}`);
   await adminRef.set(newAdmin);
   await invitedRef.update({ accepted: true });

   return 'Admin Created Successfully';
}
