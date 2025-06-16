import { BackendError, httpErrorFormatter, type BackendErrorOptions } from 'backend-error';
import type { Request, Response } from 'express';
import { auth, db } from '../firebaseSettings';
import { getAdminsService } from '../services/getAdminsService';

export async function getAdminsController(req: Request, res: Response): Promise<any> {
   // Set CORS headers
   res.set('Access-Control-Allow-Origin', '*');
   res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
   res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-website-id');
   if (req.method === 'OPTIONS') {
      res.status(204).send();
      return;
   }

   try {
      if (req.method !== 'GET') {
         throw BackendError.BadRequest('Only GET is allowed.');
      }

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         throw BackendError.Unauthorized('Missing or invalid Authorization header.');
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await auth.verifyIdToken(idToken);
      const uidFromToken = decodedToken.uid;

      const websiteID = req.headers['x-website-id'] as string;

      if (!websiteID || typeof websiteID !== 'string' || websiteID.trim() === '') {
         throw BackendError.BadRequest('websiteID is required in the x-website-id header.');
      }

      console.log('Website ID:', websiteID);
      console.log('User ID from token:', uidFromToken);
      const roleSnap = await db.ref(`admins/${websiteID}/${uidFromToken}/role`).get();
      console.log('Role snapshot:', roleSnap.val());

      if (!roleSnap.exists()) {
         throw BackendError.Forbidden('User has no role on this website.');
      }

      const userRole = roleSnap.val();
      if (userRole !== 'admin' && userRole !== 'superuser' && userRole !== 'content creator') {
         throw BackendError.Forbidden('User does not have permission to view admins.');
      }

      const admins = await getAdminsService(websiteID);
      return res.status(200).json(admins);
   } catch (error) {
      console.error('Error in getAdminsController:', error);
      const err: BackendErrorOptions = httpErrorFormatter(error);
      return res.status(err.code || 500).send(err.message || 'Internal Server Error');
   }
}
