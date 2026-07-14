import { Router } from 'express';

import { getHealth } from '../controllers/healthController.js';
import { getRoot } from '../controllers/rootController.js';
import { authRoutes } from './authRoutes.js';

export const routes = Router();

routes.get('/', getRoot);
routes.get('/health', getHealth);
routes.use('/api/auth', authRoutes);
