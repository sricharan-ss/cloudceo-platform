import { Router } from 'express';

import { getRoot } from '../controllers/rootController.js';
import { getHealth } from '../controllers/healthController.js';

export const routes = Router();

routes.get('/', getRoot);
routes.get('/health', getHealth);
