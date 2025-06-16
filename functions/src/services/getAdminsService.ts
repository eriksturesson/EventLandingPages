import { BackendError } from 'backend-error';
import { auth, db } from '../firebaseSettings';
import { DBAdminUser, DBAdminUserWithAuthMeta } from '../interfaces/dbInterfaces';

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
