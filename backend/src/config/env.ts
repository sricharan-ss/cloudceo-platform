import dotenv from 'dotenv';

dotenv.config();

type NodeEnv = 'development' | 'test' | 'production';

const toNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getRequiredSecret = (name: string, fallback: string): string => {
  const value = process.env[name];

  if (value) {
    return value;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`${name} is required in production`);
  }

  return fallback;
};

export const env = {
  nodeEnv: (process.env.NODE_ENV as NodeEnv | undefined) ?? 'development',
  port: toNumber(process.env.PORT, 5000),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL,
  jwtAccessSecret: getRequiredSecret('JWT_ACCESS_SECRET', 'development-access-secret-change-me'),
  jwtRefreshSecret: getRequiredSecret('JWT_REFRESH_SECRET', 'development-refresh-secret-change-me'),
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  refreshCookieName: process.env.REFRESH_COOKIE_NAME ?? 'cloudceo_refresh_token'
};
