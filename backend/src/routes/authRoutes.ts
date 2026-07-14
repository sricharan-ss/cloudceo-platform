import { Router } from 'express';

import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validateRequest.js';
import { loginSchema, logoutSchema, refreshSchema } from '../schemas/authSchemas.js';

export const authRoutes = Router();

authRoutes.post('/login', validateBody(loginSchema), authController.login);
authRoutes.post('/refresh', validateBody(refreshSchema), authController.refresh);
authRoutes.post('/logout', validateBody(logoutSchema), authController.logout);
authRoutes.get('/me', authenticate(), authController.me);
