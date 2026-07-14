import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from '../config/env.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { notFoundHandler } from '../middleware/notFoundHandler.js';
import { routes } from '../routes/index.js';
import { logger } from '../utils/logger.js';

export const createApp = (): express.Application => {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    morgan(env.nodeEnv === 'production' ? 'combined' : 'dev', {
      stream: {
        write: (message) => logger.http(message.trim())
      }
    })
  );

  app.use(routes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
