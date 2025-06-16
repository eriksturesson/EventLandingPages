import type { Request, Response } from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { createAdminController } from './controllers/createAdminController';
import { getAdminsController } from './controllers/getAdminsController';
import { inviteAdminController } from './controllers/inviteAdminController';

export const getAdmins = onRequest(async (req: Request, res: Response): Promise<any> => {
   return getAdminsController(req, res);
});
export const inviteAdmin = onRequest((req: Request, res: Response) => {
   return inviteAdminController(req, res);
});

export const createAdmin = onRequest(async (req: Request, res: Response): Promise<any> => {
   return createAdminController(req, res);
});
