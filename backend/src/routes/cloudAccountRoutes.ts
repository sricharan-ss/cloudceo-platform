import { Router } from 'express';

import * as cloudAccountController from '../controllers/cloudAccountController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateBody } from '../middleware/validateRequest.js';
import {
  cloudAccountCreateSchema,
  cloudAccountUpdateSchema
} from '../schemas/managementSchemas.js';

export const cloudAccountRoutes = Router();

// All cloud account routes require authentication
cloudAccountRoutes.use(authenticate());

// GET /api/cloud-accounts — any authenticated member can view cloud accounts
cloudAccountRoutes.get('/', cloudAccountController.listCloudAccounts);

// GET /api/cloud-accounts/:id — any authenticated member can view a specific account
cloudAccountRoutes.get('/:id', cloudAccountController.getCloudAccount);

// POST /api/cloud-accounts — only OWNER or ADMIN may connect a new cloud account
cloudAccountRoutes.post(
  '/',
  authorize('OWNER', 'ADMIN'),
  validateBody(cloudAccountCreateSchema),
  cloudAccountController.createCloudAccount
);

// PATCH /api/cloud-accounts/:id — only OWNER or ADMIN may update a cloud account
cloudAccountRoutes.patch(
  '/:id',
  authorize('OWNER', 'ADMIN'),
  validateBody(cloudAccountUpdateSchema),
  cloudAccountController.updateCloudAccount
);

// DELETE /api/cloud-accounts/:id — only OWNER or ADMIN may remove a cloud account
cloudAccountRoutes.delete(
  '/:id',
  authorize('OWNER', 'ADMIN'),
  cloudAccountController.deleteCloudAccount
);
