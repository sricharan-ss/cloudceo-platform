import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';

import { AppError } from '../utils/AppError.js';

export const validateBody = (schema: ZodSchema): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues.map((issue) => issue.message).join(', ');
      next(new AppError(message || 'Invalid request body', 400));
      return;
    }

    req.body = result.data;
    next();
  };
};
