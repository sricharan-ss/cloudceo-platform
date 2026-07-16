import type { RequestHandler } from 'express';

import type { AuthenticatedRequest } from '../middleware/auth.js';
import type { ResourceQuery } from '../schemas/resourceSchemas.js';
import * as resourceService from '../services/resourceService.js';
import { sendSuccess } from '../utils/apiResponse.js';

const getContext = (req: Parameters<RequestHandler>[0]) => ({
  organizationId: (req as AuthenticatedRequest).auth.organizationId,
  query: req.query as unknown as ResourceQuery
});

export const listResources: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, query } = getContext(req);
    const resources = await resourceService.listResources(organizationId, query);
    sendSuccess(res, { resources });
  } catch (error) {
    next(error);
  }
};

export const getResourceById: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId } = getContext(req);
    const resource = await resourceService.getResourceById(organizationId, String(req.params.id));
    sendSuccess(res, { resource });
  } catch (error) {
    next(error);
  }
};

export const getSummary: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId } = getContext(req);
    const summary = await resourceService.getSummary(organizationId);
    sendSuccess(res, { summary });
  } catch (error) {
    next(error);
  }
};

export const getUtilization: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, query } = getContext(req);
    const utilization = await resourceService.getUtilization(organizationId, query);
    sendSuccess(res, { utilization });
  } catch (error) {
    next(error);
  }
};

export const getCosts: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, query } = getContext(req);
    const costs = await resourceService.getCosts(organizationId, query);
    sendSuccess(res, { costs });
  } catch (error) {
    next(error);
  }
};

export const getHealth: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, query } = getContext(req);
    const health = await resourceService.getHealth(organizationId, query);
    sendSuccess(res, { health });
  } catch (error) {
    next(error);
  }
};
