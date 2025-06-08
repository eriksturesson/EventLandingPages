import type { Request, Response } from 'express';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import { onRequest } from 'firebase-functions/v2/https';
const defaultApp = initializeApp();
console.log(defaultApp.name); // '[DEFAULT]'

export interface DBAdminUser {
   [websiteID: string]: string;
   email: string;
   lastTimeSavedData: string;
}
export interface DBAdminUsers {
   [userID: string]: DBAdminUser;
}

export const createAdmin = onRequest(async (req: Request, res: Response): Promise<any> => {
   // Check that the request is a POST and contains required data
   if (req.method !== 'POST' || !req.body.email || !req.body.password || !req.body.websiteID) {
      return res.status(400).send('Email, password and websiteID are required.');
   }
   const websiteID = req.body.websiteID as string;
   if (typeof websiteID !== 'string' || websiteID.trim() === '') {
      return res.status(400).send('Invalid websiteID provided.');
   }

   // Extract userID from headers for authentication
   const requesterUserID = req.headers['userid'] as string | undefined;
   if (!requesterUserID) {
      return res.status(401).send('Unauthorized: Missing userID in headers.');
   }
   try {
      const db = getDatabase(defaultApp);

      // Verify that the requester userID is authorized by checking adminUsers in DB
      const snapshot = await db.ref(`adminUsers/${requesterUserID}`).get();
      if (!snapshot.exists()) {
         return res.status(403).send('Forbidden: User not authorized to create admins.');
      }
      const adminInviter = snapshot.val() as DBAdminUser;
      if (adminInviter[req.body.websiteID] !== 'true') {
         return res.status(403).send('Forbidden: User not authorized to create admins for this website.');
      }

      // Create the user
      const userRecord = await getAuth(defaultApp).createUser({
         email: req.body.email,
         password: req.body.password,
         displayName: req.body.displayName || 'Admin',
         disabled: false,
      });

      // Assign admin role
      await getAuth(defaultApp).setCustomUserClaims(userRecord.uid, { admin: true });

      // Save data in Realtime Database under "adminUsers/{uid}"

      const now = new Date().toISOString();

      const adminUserData = {
         email: req.body.email,
         lastTimeSavedData: now,
         [req.body.websiteID]: websiteID, // Change this value as needed, e.g. "true"
      };

      await db.ref(`adminUsers/${userRecord.uid}`).set(adminUserData);

      // Send response
      res.status(200).send(`User created with UID: ${userRecord.uid}`);
      return;
   } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).send('Something went wrong.');
      return;
   }
});
