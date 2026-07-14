import { randomUUID } from 'node:crypto';

import type { Organization, Role, User } from '@prisma/client';
import { AuditAction } from '@prisma/client';

import { prisma } from '../prisma/client.js';
import { AppError } from '../utils/AppError.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { verifyPassword } from '../utils/password.js';
import { hashToken } from '../utils/tokenHash.js';

const REFRESH_TOKEN_TTL_DAYS = 7;

type UserWithRelations = User & {
  organization: Organization;
  role: Role;
};

type RequestContext = {
  ipAddress?: string;
  userAgent?: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  user: SafeUser;
  organization: SafeOrganization;
};

export type SafeUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  role: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SafeOrganization = {
  id: string;
  name: string;
  slug: string;
};

const getRefreshExpiry = (): Date => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);
  return expiresAt;
};

const toSafeUser = (user: UserWithRelations): SafeUser => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  displayName: user.displayName,
  avatarUrl: user.avatarUrl,
  role: user.role.name,
  organizationId: user.organizationId,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const toSafeOrganization = (organization: Organization): SafeOrganization => ({
  id: organization.id,
  name: organization.name,
  slug: organization.slug
});

const auditLoginAttempt = async ({
  email,
  user,
  success,
  failureReason,
  context
}: {
  email: string;
  user?: UserWithRelations;
  success: boolean;
  failureReason?: string;
  context: RequestContext;
}): Promise<void> => {
  await prisma.loginAttempt.create({
    data: {
      email,
      userId: user?.id,
      organizationId: user?.organizationId,
      success,
      failureReason,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    }
  });

  if (user) {
    await prisma.auditLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        action: success ? AuditAction.LOGIN : AuditAction.LOGIN_FAILED,
        entityType: 'User',
        entityId: user.id,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        metadata: success ? undefined : { failureReason }
      }
    });
  }
};

const createSession = async (user: UserWithRelations): Promise<AuthSession> => {
  const role = user.role.name;
  const payload = {
    sub: user.id,
    organizationId: user.organizationId,
    role
  };
  const refreshTokenId = randomUUID();
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload, refreshTokenId);

  await prisma.refreshToken.create({
    data: {
      id: refreshTokenId,
      organizationId: user.organizationId,
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: getRefreshExpiry()
    }
  });

  return {
    accessToken,
    refreshToken,
    user: toSafeUser(user),
    organization: toSafeOrganization(user.organization)
  };
};

export const login = async (
  email: string,
  password: string,
  context: RequestContext
): Promise<AuthSession> => {
  const users = await prisma.user.findMany({
    where: {
      email,
      deletedAt: null,
      organization: {
        deletedAt: null
      }
    },
    include: {
      organization: true,
      role: true
    },
    take: 2
  });

  if (users.length > 1) {
    await auditLoginAttempt({ email, success: false, failureReason: 'AMBIGUOUS_EMAIL', context });
    throw new AppError('Multiple organizations use this email. Organization-specific login is required.', 400);
  }

  const user = users[0];

  if (!user || !user.passwordHash) {
    await auditLoginAttempt({ email, success: false, failureReason: 'INVALID_CREDENTIALS', context });
    throw new AppError('Invalid email or password', 401);
  }

  const passwordMatches = await verifyPassword(password, user.passwordHash);

  if (!passwordMatches) {
    await auditLoginAttempt({
      email,
      user,
      success: false,
      failureReason: 'INVALID_CREDENTIALS',
      context
    });
    throw new AppError('Invalid email or password', 401);
  }

  await auditLoginAttempt({ email, user, success: true, context });

  return createSession(user);
};

export const refresh = async (refreshToken: string): Promise<AuthSession> => {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError('Invalid refresh token', 401);
  }

  const tokenHash = hashToken(refreshToken);
  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: {
      user: {
        include: {
          organization: true,
          role: true
        }
      }
    }
  });

  if (
    !storedToken ||
    storedToken.revokedAt ||
    storedToken.expiresAt <= new Date() ||
    storedToken.userId !== payload.sub ||
    storedToken.organizationId !== payload.organizationId ||
    storedToken.user.deletedAt ||
    storedToken.user.organization.deletedAt
  ) {
    throw new AppError('Invalid refresh token', 401);
  }

  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revokedAt: new Date() }
  });

  await prisma.auditLog.create({
    data: {
      organizationId: storedToken.organizationId,
      userId: storedToken.userId,
      action: AuditAction.TOKEN_REFRESH,
      entityType: 'RefreshToken',
      entityId: storedToken.id
    }
  });

  return createSession(storedToken.user);
};

export const logout = async (refreshToken: string): Promise<void> => {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    return;
  }

  const tokenHash = hashToken(refreshToken);
  const storedToken = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!storedToken || storedToken.revokedAt) {
    return;
  }

  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revokedAt: new Date() }
  });

  await prisma.auditLog.create({
    data: {
      organizationId: storedToken.organizationId,
      userId: payload.sub,
      action: AuditAction.LOGOUT,
      entityType: 'RefreshToken',
      entityId: storedToken.id
    }
  });
};

export const getCurrentUser = async (userId: string): Promise<AuthSession['user'] & { organization: SafeOrganization }> => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
      organization: {
        deletedAt: null
      }
    },
    include: {
      organization: true,
      role: true
    }
  });

  if (!user) {
    throw new AppError('Authenticated user not found', 401);
  }

  return {
    ...toSafeUser(user),
    organization: toSafeOrganization(user.organization)
  };
};
