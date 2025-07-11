import { BackendError } from 'backend-error';
import { auth, db } from '../firebaseSettings';
import { DBAdminUser, DBAdminUserWithAuthMeta, InvitedAdmin } from '../interfaces/dbInterfaces';
import { getAdminInvitationService } from './getAdminInvitationService';
import { removeInviteFromDB } from './removeInviteFromDB';

export async function getAdminsAndInvitesService(websiteID: string): Promise<{
   admins: DBAdminUserWithAuthMeta[];
   invites: InvitedAdmin[];
}> {
   const [admins, invites] = await Promise.all([getAdminsService(websiteID), getAdminInvitationService(websiteID)]);

   const adminsInviteIDs = new Set(admins.map((a) => a.inviteID));
   const filteredInvites: InvitedAdmin[] = [];

   for (const invite of invites) {
      if (adminsInviteIDs.has(invite.inviteID)) {
         await removeInviteFromDB({ websiteID, inviteID: invite.inviteID });
      } else {
         filteredInvites.push(invite);
      }
   }

   return {
      admins,
      invites: filteredInvites,
   };
}

export async function getAdminsService(websiteID: string): Promise<DBAdminUserWithAuthMeta[]> {
   const adminsRef = db.ref(`admins/${websiteID}`);
   const snapshot = await adminsRef.once('value');
   const adminsRaw = snapshot.val();

   if (!adminsRaw) {
      throw BackendError.NotFound(`No admin users found for website ${websiteID}`);
   }

   const admins: Record<string, DBAdminUser> = adminsRaw;

   const enrichedAdmins: DBAdminUserWithAuthMeta[] = await Promise.all(
      Object.entries(admins).map(async ([uid, admin]) => {
         try {
            const userRecord = await auth.getUser(uid);

            return {
               ...admin,
               createdAt: userRecord.metadata.creationTime || '',
               lastLogin: userRecord.metadata.lastSignInTime || '',
            };
         } catch (error: any) {
            throw new BackendError({
               code: 500,
               message: `Failed to enrich admin user ${uid}: ${error.message}`,
               data: { uid, admin },
            });
         }
      })
   );

   return enrichedAdmins;
}
