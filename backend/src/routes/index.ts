import { Router } from 'express';

import { getHealth } from '../controllers/healthController.js';
import { getRoot } from '../controllers/rootController.js';
import { authRoutes } from './authRoutes.js';
import { cloudAccountRoutes } from './cloudAccountRoutes.js';
import { dashboardRoutes } from './dashboardRoutes.js';
import { organizationRoutes } from './organizationRoutes.js';
import { syncRoutes } from './syncRoutes.js';

export const routes = Router();

routes.get('/', getRoot);
routes.get('/health', getHealth);
routes.use('/api/auth', authRoutes);
routes.use('/api/organization', organizationRoutes);
routes.use('/api/cloud-accounts', cloudAccountRoutes);
routes.use('/api/sync', syncRoutes);
routes.use('/api/dashboard', dashboardRoutes);
