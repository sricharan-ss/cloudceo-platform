import { Router } from 'express';

import * as dashboardController from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';

export const dashboardRoutes = Router();

dashboardRoutes.use(authenticate());

dashboardRoutes.get('/summary', dashboardController.getDashboardSummary);
dashboardRoutes.get('/executive-summary', dashboardController.getExecutiveSummary);
dashboardRoutes.get('/kpis', dashboardController.getKpis);
dashboardRoutes.get('/cost-summary', dashboardController.getCostSummary);
dashboardRoutes.get('/cloud-health', dashboardController.getCloudHealth);
dashboardRoutes.get('/recent-activity', dashboardController.getRecentActivity);
dashboardRoutes.get('/ai-summary', dashboardController.getAiSummary);
dashboardRoutes.get('/quick-actions', dashboardController.getQuickActions);
