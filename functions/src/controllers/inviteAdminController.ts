import { BackendError, httpErrorFormatter } from 'backend-error';
import type { Request, Response } from 'express';
import { auth, db } from '../firebaseSettings';
import { inviteAdminService } from '../services/inviteAdminService';

export async function inviteAdminController(req: Request, res: Response): Promise<any> {
   // Set CORS headers for preflight and actual requests
   res.set('Access-Control-Allow-Origin', '*'); // Or restrict to specific domain(s)
   res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
   res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   if (req.method === 'OPTIONS') {
      res.status(204).send(); // Preflight
      return;
   }

   try {
      if (req.method !== 'POST') {
         throw BackendError.BadRequest('Only POST is allowed.');
      }
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         throw BackendError.Unauthorized('Missing or invalid Authorization header.');
      }
      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await auth.verifyIdToken(idToken);
      const uidFromToken = decodedToken.uid;

      const { email, role, websiteID } = req.body;
      const inviterRoleSnap = await db.ref(`admins/${websiteID}/${uidFromToken}/role`).get();
      if (!inviterRoleSnap.exists()) {
         throw BackendError.Forbidden('User has no role on this website.');
      }
      const inviterRole = inviterRoleSnap.val();
      if (inviterRole !== 'admin' && inviterRole !== 'superuser') {
         throw BackendError.Forbidden('User does not have permission to invite admins.');
      }
      if (!email || typeof email !== 'string') {
         throw BackendError.BadRequest('Email is required and must be a string.');
      }

      if (!role || (role !== 'admin' && role !== 'content creator')) {
         throw BackendError.BadRequest('Role must be either "admin" or "content creator".');
      }

      if (!websiteID || typeof websiteID !== 'string' || websiteID.trim() === '') {
         throw BackendError.BadRequest('websiteID is required and must be a non-empty string.');
      }

      let inviteID = await inviteAdminService({ email, role, websiteID, invitedBy: uidFromToken });

      return res.status(200).json({ inviteID, email, message: 'Admin invite created successfully.' });
   } catch (error) {
      const err = httpErrorFormatter(error);
      return res.status(err.status).json(err.body);
   }
}
