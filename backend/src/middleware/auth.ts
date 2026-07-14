import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { prisma } from '../prisma/client.js';
import { AppError } from '../utils/AppError.js';
import { verifyAccessToken } from '../utils/jwt.js';

export type AuthContext = {
  userId: string;
  organizationId: string;
  role: string;
};

export type AuthenticatedRequest = Request & {
  auth: AuthContext;
};

const getBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');
  return scheme?.toLowerCase() === 'bearer' && token ? token : null;
};

const normalizeRole = (role: string): string => {
  return role.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[\s-]+/g, '_').toUpperCase();
};

export const authenticate = (): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      next(new AppError('Authentication required', 401));
      return;
    }

    try {
      const payload = verifyAccessToken(token);
      const user = await prisma.user.findFirst({
        where: {
          id: payload.sub,
          organizationId: payload.organizationId,
          deletedAt: null,
          organization: {
            deletedAt: null
          }
        },
        include: {
          role: true
        }
      });

      if (!user) {
        next(new AppError('Authentication required', 401));
        return;
      }

      (req as AuthenticatedRequest).auth = {
        userId: user.id,
        organizationId: user.organizationId,
        role: user.role.name
      };

      next();
    } catch {
      next(new AppError('Invalid or expired access token', 401));
    }
  };
};

export const authorize = (...allowedRoles: string[]): RequestHandler => {
  const normalizedAllowedRoles = allowedRoles.map(normalizeRole);

  return (req: Request, _res: Response, next: NextFunction) => {
    const auth = (req as Partial<AuthenticatedRequest>).auth;

    if (!auth) {
      next(new AppError('Authentication required', 401));
      return;
    }

    if (!normalizedAllowedRoles.includes(normalizeRole(auth.role))) {
      next(new AppError('Insufficient permissions', 403));
      return;
    }

    next();
  };
};
