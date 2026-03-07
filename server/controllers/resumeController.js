import { store } from '../models/jsonStore.js';

const ALLOWED_FORMATS = new Set(['pdf', 'doc', 'txt', 'md']);
const ALLOWED_PLACEMENTS = new Set(['hero', 'about', 'contact', 'footer', 'chat', 'floating', 'unknown']);

function normalizeSafe(value) {
  return String(value || '').trim().toLowerCase();
}

export async function trackResumeDownload(req, res, next) {
  try {
    const format = normalizeSafe(req.body?.format);
    const placement = normalizeSafe(req.body?.placement || 'unknown');
    const source = normalizeSafe(req.body?.source || 'unknown');

    if (!ALLOWED_FORMATS.has(format)) {
      return res.status(400).json({ ok: false, message: 'Invalid resume format.' });
    }

    if (!ALLOWED_PLACEMENTS.has(placement)) {
      return res.status(400).json({ ok: false, message: 'Invalid resume placement.' });
    }

    const summary = await store.trackResumeDownload({
      format,
      placement,
      source,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent') || '',
    });

    return res.status(201).json({ ok: true, data: summary });
  } catch (error) {
    return next(error);
  }
}

export async function getResumeStats(req, res, next) {
  try {
    const stats = await store.getResumeStats();
    return res.json({ ok: true, data: stats });
  } catch (error) {
    return next(error);
  }
}
