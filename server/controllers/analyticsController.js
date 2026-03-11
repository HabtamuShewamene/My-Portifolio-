import { store } from '../models/jsonStore.js';
import crypto from 'node:crypto';
import { analyticsStreamService } from '../services/analyticsStreamService.js';

function normalizePeriod(value) {
  const period = String(value || 'all').toLowerCase();
  if (['today', 'week', 'month', 'all'].includes(period)) return period;
  return 'all';
}

function normalizeCoordinate(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function anonymizeIp(ipAddress) {
  const raw = String(ipAddress || 'unknown').trim();
  return crypto.createHash('sha256').update(raw).digest('hex').slice(0, 24);
}

export async function trackAnalytics(req, res, next) {
  try {
    const payload = req.body || {};
    const events = Array.isArray(payload.events) ? payload.events : [];
    const summary = await store.trackAnalytics({ events });
    if (summary?.accepted > 0) {
      analyticsStreamService.publish({
        source: 'track',
        accepted: summary.accepted,
        updatedAt: summary.updatedAt,
      });
    }
    return res.status(201).json({ ok: true, data: summary });
  } catch (error) {
    return next(error);
  }
}

export async function trackAnalyticsLocation(req, res, next) {
  try {
    const payload = req.body || {};
    const event = {
      sessionId: String(payload.sessionId || 'anonymous'),
      eventType: 'location_ping',
      country: String(payload.country || payload.countryCode || 'unknown').toUpperCase(),
      city: String(payload.city || 'unknown'),
      region: String(payload.region || 'unknown'),
      lat: normalizeCoordinate(payload.lat),
      lng: normalizeCoordinate(payload.lng),
      consent: payload.consent === true,
      dnt: payload.dnt === true,
      anonIpHash: anonymizeIp(req.ip),
      page: String(payload.page || 'portfolio-home'),
      path: String(payload.path || '/'),
    };

    const summary = await store.trackAnalytics({ events: [event] });
    if (summary?.accepted > 0) {
      analyticsStreamService.publish({
        source: 'location',
        accepted: summary.accepted,
        updatedAt: summary.updatedAt,
      });
    }
    return res.status(201).json({ ok: true, data: summary });
  } catch (error) {
    return next(error);
  }
}

export async function streamAnalytics(req, res) {
  analyticsStreamService.subscribe(req, res);
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
