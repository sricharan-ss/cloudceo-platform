import type { Request, RequestHandler } from 'express';

import { env } from '../config/env.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import type { LoginInput, LogoutInput, RefreshInput } from '../schemas/authSchemas.js';
import * as authService from '../services/authService.js';
import { AppError } from '../utils/AppError.js';

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'strict' as const,
  path: '/api/auth'
};

const requestContext = (req: Request) => ({
  ipAddress: req.ip,
  userAgent: req.get('user-agent')
});

const getRefreshToken = (req: Request, body?: RefreshInput | LogoutInput): string | undefined => {
  return body?.refreshToken ?? req.cookies?.[env.refreshCookieName];
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const body = req.body as LoginInput;
    const session = await authService.login(body.email, body.password, requestContext(req));

    res.cookie(env.refreshCookieName, session.refreshToken, cookieOptions);
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
};

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = getRefreshToken(req, req.body as RefreshInput);

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    const session = await authService.refresh(refreshToken);

    res.cookie(env.refreshCookieName, session.refreshToken, cookieOptions);
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = getRefreshToken(req, req.body as LogoutInput);

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie(env.refreshCookieName, cookieOptions);
    res.status(200).json({ status: 'success', message: 'Logged out' });
  } catch (error) {
    next(error);
  }
};

export const me: RequestHandler = async (req, res, next) => {
  try {
    const auth = (req as AuthenticatedRequest).auth;
    const user = await authService.getCurrentUser(auth.userId);

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
