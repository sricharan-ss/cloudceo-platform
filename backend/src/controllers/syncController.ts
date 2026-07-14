import type { RequestHandler } from 'express';

import type { AuthenticatedRequest } from '../middleware/auth.js';
import type { SyncServiceKind } from '../services/syncService.js';
import * as syncService from '../services/syncService.js';
import { sendSuccess } from '../utils/apiResponse.js';

const run = (service: SyncServiceKind): RequestHandler => {
  return async (req, res, next) => {
    try {
      const { organizationId } = (req as AuthenticatedRequest).auth;
      const cloudAccountId = String(req.params.cloudAccountId);
      const result = await syncService.runSync(organizationId, cloudAccountId, service);

      sendSuccess(res, {
        syncJob: result.job,
        recordsFetched: result.recordsFetched,
        records: result.records
      });
    } catch (error) {
      next(error);
    }
  };
};

export const syncResources = run('resources');
export const syncBilling = run('billing');
export const syncSecurity = run('security');
export const syncReports = run('reports');
