import { BackendError, httpErrorFormatter, type BackendErrorOptions } from 'backend-error';
import type { Request, Response } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import { inviteAdminService } from '../services/inviteAdminService';

export async function inviteAdminController(req: Request, res: Response): Promise<void> {
   // Set CORS headers for preflight and actual requests
   res.setHeader('Access-Control-Allow-Origin', '*'); // Or restrict to specific domain(s)
   res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const uidFromToken = decodedToken.uid;

      const db = getDatabase();

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

      await inviteAdminService({ email, role, websiteID, invitedBy: uidFromToken });

      res.status(200).send('Admin invitation request received.');
   } catch (error) {
      console.error('Error in inviteAdminController:', error);
      const err: BackendErrorOptions = httpErrorFormatter(error);
      res.status(err.code || 500).send(err.message || 'Internal Server Error');
   }
}
