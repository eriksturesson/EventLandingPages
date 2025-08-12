import type { Request, Response } from 'express';
import cors from 'cors';
import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { createAdminController } from './controllers/createAdminController';
import { getAdminsController } from './controllers/getAdminsController';
import { inviteAdminController } from './controllers/inviteAdminController';
const app = express();
// Use JSON middleware to parse JSON bodies for all routes

app.use(
   cors({
      origin: '*',
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-website-id'],
   })
);
app.use(express.json());

app.get('/getAdmins', getAdminsController);
app.post('/inviteAdmin', inviteAdminController);
app.post('/createAdmin', createAdminController);
export const api = onRequest(app);
