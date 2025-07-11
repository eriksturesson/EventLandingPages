import { BackendError } from 'backend-error';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../firebaseSettings';
import { InvitedAdmin } from '../interfaces/dbInterfaces';

interface InviteAdminProps {
   email: string;
   role: 'admin' | 'content creator';
   websiteID: string;
   invitedByUserID: string;
   invitedByEmail: string;
}

export async function inviteAdminService(args: InviteAdminProps): Promise<string> {
   const { email, role, websiteID, invitedByEmail, invitedByUserID } = args;
   const invitedAdminsRef = db.ref(`invitedAdmins/${websiteID}`);

   // Läs alla inbjudningar för detta websiteID
   const snapshot = await invitedAdminsRef.once('value');
   const invitedAdmins: Record<string, InvitedAdmin> = snapshot.val() || {};

   // Kolla om email redan är inbjudet och inbjudan är giltig (<24h och inte accepterad)
   const now = Date.now();
   const validInvite = Object.values(invitedAdmins).find((invite) => {
      if (invite.email.toLowerCase() !== email.toLowerCase()) return false;
      if (invite.accepted) return false;
      const invitedAtTime = new Date(invite.invitedAt).getTime();
      return now - invitedAtTime < 24 * 60 * 60 * 1000; // 24 timmar i ms
   });

   if (validInvite) {
      // Returnera befintlig inviteID om det finns en giltig inbjudan
      throw new BackendError({
         code: 409,
         data: {
            email: validInvite.email,
            inviteID: validInvite.inviteID,
            invitedAt: validInvite.invitedAt,
         },
         message: `Conflict:An invite for ${email} already exists and is valid until ${new Date(
            new Date(validInvite.invitedAt).getTime() + 24 * 60 * 60 * 1000
         ).toISOString()}.`,
      });
   }
   // Generate unique invite ID/token
   const inviteID = uuidv4();

   // Compose the invite object
   const inviteData: InvitedAdmin = {
      email,
      role,
      websiteID,
      invitedByUserID,
      invitedByEmail,
      invitedAt: new Date().toISOString(),
      accepted: false, // to track if invite accepted
      inviteID, // store the token/ID
   };

   // Reference to your invitedAdmins path
   const ref = db.ref(`invitedAdmins/${websiteID}/${inviteID}`);

   // Store invite data
   await ref.set(inviteData);

   // Build invite link that frontend can share:
   // e.g.`${window.location.host}/create-admin?id=${inviteID}`
   return inviteID;
}
