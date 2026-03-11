import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

export const contactLimiter = rateLimit({
  windowMs: env.rateLimits.contact.windowMs,
  max: env.rateLimits.contact.max,
  message: { ok: false, message: 'Too many contact requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const chatLimiter = rateLimit({
  windowMs: env.rateLimits.chat.windowMs,
  max: env.rateLimits.chat.max,
  message: { ok: false, message: 'Too many chat requests. Slow down and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 180,
  message: { ok: false, message: 'Too many analytics events. Slow down and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const locationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { ok: false, message: 'Too many location pings. Please retry later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
