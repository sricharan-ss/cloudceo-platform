import { Router } from 'express';

import * as securityController from '../controllers/securityController.js';
import { authenticate } from '../middleware/auth.js';
import { validateQuery } from '../middleware/validateRequest.js';
import { securityQuerySchema } from '../schemas/securitySchemas.js';

export const securityRoutes = Router();

securityRoutes.use(authenticate());
securityRoutes.use(validateQuery(securityQuerySchema));

securityRoutes.get('/overview', securityController.getOverview);
securityRoutes.get('/events', securityController.listEvents);
securityRoutes.get('/events/:id', securityController.getEventById);
securityRoutes.get('/activity', securityController.getActivity);
securityRoutes.get('/blocked-ips', securityController.getBlockedIps);
securityRoutes.get('/vulnerabilities', securityController.getVulnerabilities);
securityRoutes.get('/compliance', securityController.getCompliance);
securityRoutes.get('/recommendations', securityController.getRecommendations);
