import { store } from '../models/jsonStore.js';

function normalizePeriod(value) {
  const period = String(value || 'all').toLowerCase();
  if (['today', 'week', 'month', 'all'].includes(period)) return period;
  return 'all';
}

export async function trackAnalytics(req, res, next) {
  try {
    const payload = req.body || {};
    const events = Array.isArray(payload.events) ? payload.events : [];
    const summary = await store.trackAnalytics({ events });
    return res.status(201).json({ ok: true, data: summary });
  } catch (error) {
    return next(error);
  }
}

export async function getAnalyticsVisitors(req, res, next) {
  try {
    const data = await store.getAnalyticsVisitors();
    return res.json({ ok: true, data });
  } catch (error) {
    return next(error);
  }
}

export async function getAnalyticsLocations(req, res, next) {
  try {
    const period = normalizePeriod(req.query?.period);
    const data = await store.getAnalyticsLocations(period);
    return res.json({ ok: true, data });
  } catch (error) {
    return next(error);
  }
}

export async function getAnalyticsSections(req, res, next) {
  try {
    const period = normalizePeriod(req.query?.period);
    const data = await store.getAnalyticsSections(period);
    return res.json({ ok: true, data });
  } catch (error) {
    return next(error);
  }
}

export async function getAnalyticsProjects(req, res, next) {
  try {
    const period = normalizePeriod(req.query?.period);
    const data = await store.getAnalyticsProjects(period);
    return res.json({ ok: true, data });
  } catch (error) {
    return next(error);
  }
}

export async function getAnalyticsDevices(req, res, next) {
  try {
    const period = normalizePeriod(req.query?.period);
    const data = await store.getAnalyticsDevices(period);
    return res.json({ ok: true, data });
  } catch (error) {
    return next(error);
  }
}

export async function getAnalyticsDashboard(req, res, next) {
  try {
    const period = normalizePeriod(req.query?.period);
    const data = await store.getAnalyticsDashboard(period);
    return res.json({ ok: true, data });
  } catch (error) {
    return next(error);
  }
}
