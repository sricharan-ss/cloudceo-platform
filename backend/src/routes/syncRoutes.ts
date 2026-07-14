import { Router } from 'express';

import * as syncController from '../controllers/syncController.js';
import { authenticate } from '../middleware/auth.js';

export const syncRoutes = Router();

syncRoutes.post('/:cloudAccountId/resources', authenticate(), syncController.syncResources);
syncRoutes.post('/:cloudAccountId/billing', authenticate(), syncController.syncBilling);
syncRoutes.post('/:cloudAccountId/security', authenticate(), syncController.syncSecurity);
syncRoutes.post('/:cloudAccountId/reports', authenticate(), syncController.syncReports);
