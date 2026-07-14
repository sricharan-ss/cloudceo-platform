import { Router } from 'express';

import * as organizationController from '../controllers/organizationController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateBody } from '../middleware/validateRequest.js';
import { organizationUpdateSchema } from '../schemas/managementSchemas.js';

export const organizationRoutes = Router();

// All organization routes require authentication
organizationRoutes.use(authenticate());

// GET /api/organization — any authenticated member can view their org
organizationRoutes.get('/', organizationController.getOrganization);

// GET /api/organization/members — any authenticated member can view the member list
organizationRoutes.get('/members', organizationController.getOrganizationMembers);

// PATCH /api/organization — only OWNER or ADMIN may update org settings
organizationRoutes.patch(
  '/',
  authorize('OWNER', 'ADMIN'),
  validateBody(organizationUpdateSchema),
  organizationController.updateOrganization
);
