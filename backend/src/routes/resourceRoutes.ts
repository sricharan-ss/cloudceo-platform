import { Router } from 'express';

import * as resourceController from '../controllers/resourceController.js';
import { authenticate } from '../middleware/auth.js';
import { validateQuery } from '../middleware/validateRequest.js';
import { resourceQuerySchema } from '../schemas/resourceSchemas.js';

export const resourceRoutes = Router();

resourceRoutes.use(authenticate());
resourceRoutes.use(validateQuery(resourceQuerySchema));

resourceRoutes.get('/', resourceController.listResources);
resourceRoutes.get('/summary', resourceController.getSummary);
resourceRoutes.get('/utilization', resourceController.getUtilization);
resourceRoutes.get('/cost', resourceController.getCosts);
resourceRoutes.get('/health', resourceController.getHealth);
resourceRoutes.get('/:id', resourceController.getResourceById);
