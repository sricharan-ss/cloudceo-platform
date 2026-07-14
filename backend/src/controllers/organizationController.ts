import type { RequestHandler } from 'express';

import type { AuthenticatedRequest } from '../middleware/auth.js';
import type { OrganizationUpdateInput } from '../schemas/managementSchemas.js';
import * as organizationService from '../services/organizationService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { writeAuditLog } from '../utils/auditLog.js';
import { AuditAction } from '@prisma/client';

export const getOrganization: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId } = (req as AuthenticatedRequest).auth;
    const org = await organizationService.getOrganization(organizationId);
    sendSuccess(res, { organization: org });
  } catch (error) {
    next(error);
  }
};

export const updateOrganization: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, userId } = (req as AuthenticatedRequest).auth;
    const body = req.body as OrganizationUpdateInput;

    const updated = await organizationService.updateOrganization(organizationId, body);

    await writeAuditLog({
      organizationId,
      userId,
      action: AuditAction.UPDATE,
      entityType: 'Organization',
      entityId: organizationId,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    sendSuccess(res, { organization: updated });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationMembers: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId } = (req as AuthenticatedRequest).auth;
    const members = await organizationService.getOrganizationMembers(organizationId);
    sendSuccess(res, { members });
  } catch (error) {
    next(error);
  }
};
