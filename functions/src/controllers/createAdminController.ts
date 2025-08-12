import { BackendError, httpErrorFormatter } from 'backend-error';
import type { Request, Response } from 'express';
import { auth } from '../firebaseSettings';
import { storeNewAdminService } from '../services/storeNewAdminService';

export async function createAdminController(req: Request, res: Response): Promise<any> {
   try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         throw BackendError.Unauthorized('Missing or invalid Authorization header.');
      }
      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await auth.verifyIdToken(idToken);
      const uidFromToken = decodedToken.uid;

      const { email, websiteID, inviteID } = req.body;

      if (!inviteID || typeof inviteID !== 'string' || inviteID.trim() === '') {
         throw BackendError.BadRequest('inviteID is required and must be a non-empty string.');
      }
      if (!email || typeof email !== 'string') {
         throw BackendError.BadRequest('Email is required and must be a string.');
      }

      if (!websiteID || typeof websiteID !== 'string' || websiteID.trim() === '') {
         throw BackendError.BadRequest('websiteID is required and must be a non-empty string.');
      }

      let doneString = await storeNewAdminService({ email, userID: uidFromToken, websiteID, inviteID });

      return res.status(200).json({ message: doneString });
   } catch (error) {
      const err = httpErrorFormatter(error);
      console.error('Error in createAdminController:', error);
      return res.status(err.status).json(err.body);
   }
}
