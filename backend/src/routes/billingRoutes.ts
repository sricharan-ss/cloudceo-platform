import { Router } from 'express';

import * as billingController from '../controllers/billingController.js';
import { authenticate } from '../middleware/auth.js';
import { validateQuery } from '../middleware/validateRequest.js';
import { billingQuerySchema } from '../schemas/billingSchemas.js';

export const billingRoutes = Router();

billingRoutes.use(authenticate());
billingRoutes.use(validateQuery(billingQuerySchema));

billingRoutes.get('/overview', billingController.getOverview);
billingRoutes.get('/trend', billingController.getTrend);
billingRoutes.get('/services', billingController.getServices);
billingRoutes.get('/providers', billingController.getProviders);
billingRoutes.get('/regions', billingController.getRegions);
billingRoutes.get('/recommendations', billingController.getRecommendations);
billingRoutes.get('/forecast', billingController.getForecast);
