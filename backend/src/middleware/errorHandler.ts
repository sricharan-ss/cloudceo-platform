import type { ErrorRequestHandler } from 'express';

import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const isKnownError = error instanceof AppError;
  const statusCode = isKnownError ? error.statusCode : 500;
  const message = isKnownError ? error.message : 'Internal server error';

  logger.error(error instanceof Error ? error.stack ?? error.message : String(error));

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(env.nodeEnv === 'development' && !isKnownError ? { details: String(error) } : {})
  });
};
