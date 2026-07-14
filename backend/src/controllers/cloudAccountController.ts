import type { RequestHandler } from 'express';

import type { AuthenticatedRequest } from '../middleware/auth.js';
import type {
  CloudAccountCreateInput,
  CloudAccountUpdateInput
} from '../schemas/managementSchemas.js';
import * as cloudAccountService from '../services/cloudAccountService.js';
import { sendSuccess } from '../utils/apiResponse.js';

const requestContext = (req: Parameters<RequestHandler>[0]) => ({
  ipAddress: req.ip,
  userAgent: req.get('user-agent')
});

export const listCloudAccounts: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId } = (req as AuthenticatedRequest).auth;
    const accounts = await cloudAccountService.listCloudAccounts(organizationId);
    sendSuccess(res, { accounts });
  } catch (error) {
    next(error);
  }
};

export const getCloudAccount: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId } = (req as AuthenticatedRequest).auth;
    const id = String(req.params.id);
    const account = await cloudAccountService.getCloudAccount(organizationId, id);
    sendSuccess(res, { account });
  } catch (error) {
    next(error);
  }
};

export const createCloudAccount: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, userId } = (req as AuthenticatedRequest).auth;
    const body = req.body as CloudAccountCreateInput;
    const account = await cloudAccountService.createCloudAccount(
      organizationId,
      userId,
      body,
      requestContext(req)
    );
    sendSuccess(res, { account }, 201);
  } catch (error) {
    next(error);
  }
};

export const updateCloudAccount: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, userId } = (req as AuthenticatedRequest).auth;
    const id = String(req.params.id);
    const body = req.body as CloudAccountUpdateInput;
    const account = await cloudAccountService.updateCloudAccount(
      organizationId,
      userId,
      id,
      body,
      requestContext(req)
    );
    sendSuccess(res, { account });
  } catch (error) {
    next(error);
  }
};

export const deleteCloudAccount: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, userId } = (req as AuthenticatedRequest).auth;
    const id = String(req.params.id);
    await cloudAccountService.deleteCloudAccount(organizationId, userId, id, requestContext(req));
    sendSuccess(res, { message: 'Cloud account deleted' });
  } catch (error) {
    next(error);
  }
};
