import type { RequestHandler } from 'express';

import type { AuthenticatedRequest } from '../middleware/auth.js';
import * as dashboardService from '../services/dashboardService.js';
import { sendSuccess } from '../utils/apiResponse.js';

const organizationIdFrom = (req: Parameters<RequestHandler>[0]): string => {
  return (req as AuthenticatedRequest).auth.organizationId;
};

export const getDashboardSummary: RequestHandler = async (req, res, next) => {
  try {
    const summary = await dashboardService.getDashboardSummary(organizationIdFrom(req));
    sendSuccess(res, { summary });
  } catch (error) {
    next(error);
  }
};

export const getExecutiveSummary: RequestHandler = async (req, res, next) => {
  try {
    const executiveSummary = await dashboardService.getExecutiveSummary(organizationIdFrom(req));
    sendSuccess(res, { executiveSummary });
  } catch (error) {
    next(error);
  }
};

export const getKpis: RequestHandler = async (req, res, next) => {
  try {
    const kpis = await dashboardService.getKpis(organizationIdFrom(req));
    sendSuccess(res, { kpis });
  } catch (error) {
    next(error);
  }
};

export const getCostSummary: RequestHandler = async (req, res, next) => {
  try {
    const costSummary = await dashboardService.getCostSummary(organizationIdFrom(req));
    sendSuccess(res, { costSummary });
  } catch (error) {
    next(error);
  }
};

export const getCloudHealth: RequestHandler = async (req, res, next) => {
  try {
    const cloudHealth = await dashboardService.getCloudHealth(organizationIdFrom(req));
    sendSuccess(res, { cloudHealth });
  } catch (error) {
    next(error);
  }
};

export const getRecentActivity: RequestHandler = async (req, res, next) => {
  try {
    const recentActivity = await dashboardService.getRecentActivity(organizationIdFrom(req));
    sendSuccess(res, { recentActivity });
  } catch (error) {
    next(error);
  }
};

export const getAiSummary: RequestHandler = async (req, res, next) => {
  try {
    const aiSummary = await dashboardService.getAiExecutiveSummary(organizationIdFrom(req));
    sendSuccess(res, { aiSummary });
  } catch (error) {
    next(error);
  }
};

export const getQuickActions: RequestHandler = async (req, res, next) => {
  try {
    const quickActions = await dashboardService.getQuickActions(organizationIdFrom(req));
    sendSuccess(res, { quickActions });
  } catch (error) {
    next(error);
  }
};
