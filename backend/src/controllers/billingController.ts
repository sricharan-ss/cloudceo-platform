import type { RequestHandler } from 'express';

import type { AuthenticatedRequest } from '../middleware/auth.js';
import type { BillingQuery } from '../schemas/billingSchemas.js';
import * as billingService from '../services/billingService.js';
import { sendSuccess } from '../utils/apiResponse.js';

const getContext = (req: Parameters<RequestHandler>[0]) => ({
  organizationId: (req as AuthenticatedRequest).auth.organizationId,
  query: req.query as unknown as BillingQuery
});

export const getOverview: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, query } = getContext(req);
    const overview = await billingService.getOverview(organizationId, query);
    sendSuccess(res, { overview });
  } catch (error) {
    next(error);
  }
};

export const getTrend: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, query } = getContext(req);
    const trend = await billingService.getTrend(organizationId, query);
    sendSuccess(res, { trend });
  } catch (error) {
    next(error);
  }
};

export const getServices: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, query } = getContext(req);
    const services = await billingService.getServices(organizationId, query);
    sendSuccess(res, { services });
  } catch (error) {
    next(error);
  }
};

export const getProviders: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, query } = getContext(req);
    const providers = await billingService.getProviders(organizationId, query);
    sendSuccess(res, { providers });
  } catch (error) {
    next(error);
  }
};

export const getRegions: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, query } = getContext(req);
    const regions = await billingService.getRegions(organizationId, query);
    sendSuccess(res, { regions });
  } catch (error) {
    next(error);
  }
};

export const getRecommendations: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, query } = getContext(req);
    const recommendations = await billingService.getRecommendations(organizationId, query);
    sendSuccess(res, { recommendations });
  } catch (error) {
    next(error);
  }
};

export const getForecast: RequestHandler = async (req, res, next) => {
  try {
    const { organizationId, query } = getContext(req);
    const forecast = await billingService.getForecast(organizationId, query);
    sendSuccess(res, { forecast });
  } catch (error) {
    next(error);
  }
};
