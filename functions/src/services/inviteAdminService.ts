import { getDatabase } from 'firebase-admin/database';
import { v4 as uuidv4 } from 'uuid';

interface InviteAdminProps {
   email: string;
   role: 'admin' | 'content creator';
   websiteID: string;
   invitedBy: string;
}

export async function inviteAdminService(args: InviteAdminProps): Promise<string> {
   const { email, role, websiteID, invitedBy } = args;

   // Generate unique invite ID/token
   const inviteId = uuidv4();

   // Compose the invite object
   const inviteData = {
      email,
      role,
      websiteID,
      invitedBy,
      invitedAt: new Date().toISOString(),
      accepted: false, // to track if invite accepted
      inviteId, // store the token/ID
   };

   // Reference to your invitedAdmins path
   const db = getDatabase();
   const ref = db.ref(`invitedAdmins/${websiteID}/${inviteId}`);

   // Store invite data
   await ref.set(inviteData);

   // Build invite link that frontend can share:
   // e.g. https://yourapp.com/invite-admin?inviteId=xxxx
   return inviteId;
}
