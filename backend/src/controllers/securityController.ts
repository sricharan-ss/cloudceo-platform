import type { RequestHandler } from 'express';

import type { AuthenticatedRequest } from '../middleware/auth.js';
import type { SecurityQuery } from '../schemas/securitySchemas.js';
import * as securityService from '../services/securityService.js';
import { sendSuccess } from '../utils/apiResponse.js';

const getContext = (req: Parameters<RequestHandler>[0]) => ({
  organizationId: (req as AuthenticatedRequest).auth.organizationId,
  query: req.query as unknown as SecurityQuery
});

export const getOverview: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, query } = getContext(req);
    const overview = await securityService.getOverview(organizationId, query);
    sendSuccess(res, { overview });
  } catch (error) {
    next(error);
  }
};

export const listEvents: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, query } = getContext(req);
    const events = await securityService.listEvents(organizationId, query);
    sendSuccess(res, { events });
  } catch (error) {
    next(error);
  }
};

export const getEventById: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId } = getContext(req);
    const event = await securityService.getEventById(organizationId, String(req.params.id));
    sendSuccess(res, { event });
  } catch (error) {
    next(error);
  }
};

export const getActivity: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, query } = getContext(req);
    const activity = await securityService.getActivity(organizationId, query);
    sendSuccess(res, { activity });
  } catch (error) {
    next(error);
  }
};

export const getBlockedIps: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, query } = getContext(req);
    const blockedIps = await securityService.getBlockedIps(organizationId, query);
    sendSuccess(res, { blockedIps });
  } catch (error) {
    next(error);
  }
};

export const getVulnerabilities: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, query } = getContext(req);
    const vulnerabilities = await securityService.getVulnerabilities(organizationId, query);
    sendSuccess(res, { vulnerabilities });
  } catch (error) {
    next(error);
  }
};

export const getCompliance: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, query } = getContext(req);
    const compliance = await securityService.getCompliance(organizationId, query);
    sendSuccess(res, { compliance });
  } catch (error) {
    next(error);
  }
};

export const getRecommendations: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, query } = getContext(req);
    const recommendations = await securityService.getRecommendations(organizationId, query);
    sendSuccess(res, { recommendations });
  } catch (error) {
    next(error);
  }
};
