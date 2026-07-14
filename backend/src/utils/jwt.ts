import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';

export type AuthTokenPayload = {
  sub: string;
  organizationId: string;
  role: string;
};

export type RefreshTokenPayload = AuthTokenPayload & {
  jti: string;
};

const signOptions = (expiresIn: string, jwtid?: string): jwt.SignOptions => ({
  expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  ...(jwtid ? { jwtid } : {})
});

export const signAccessToken = (payload: AuthTokenPayload): string => {
  return jwt.sign(payload, env.jwtAccessSecret, signOptions(env.jwtAccessExpiresIn));
};

export const signRefreshToken = (payload: AuthTokenPayload, tokenId: string): string => {
  return jwt.sign(payload, env.jwtRefreshSecret, signOptions(env.jwtRefreshExpiresIn, tokenId));
};

export const verifyAccessToken = (token: string): AuthTokenPayload => {
  return jwt.verify(token, env.jwtAccessSecret) as AuthTokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, env.jwtRefreshSecret) as RefreshTokenPayload;
};
