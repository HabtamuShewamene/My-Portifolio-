import cors from 'cors';
import { env } from './env.js';

function normalizeOrigin(origin) {
  return origin?.replace(/\/+$/, '');
}

const allowedOrigins = new Set(
  [...env.clientOrigins, env.clientOrigin]
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean),
);

function isLocalDevOrigin(origin) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
}

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const normalizedOrigin = normalizeOrigin(origin);

    if (allowedOrigins.has(normalizedOrigin)) return callback(null, true);
    if (env.nodeEnv !== 'production' && isLocalDevOrigin(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS blocked for this origin'));
  },
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 204,
});
