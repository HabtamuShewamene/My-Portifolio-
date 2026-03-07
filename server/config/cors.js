import cors from 'cors';
import { env } from './env.js';

function normalizeOrigin(origin) {
  return origin?.trim().replace(/\/+$/, '');
}

const devOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

const envOrigins = [...(env.clientOrigins || []), env.clientOrigin]
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

const allowedOrigins = new Set(
  (env.nodeEnv === 'production' ? envOrigins : [...devOrigins, ...envOrigins])
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean),
);

function isLocalDevOrigin(origin) {
  return /^https?:\/\/(localhost|127\.0\.0\.1):(3000|5173)$/i.test(origin);
}

export const corsMiddleware = cors({
  origin(origin, callback) {
    // Allow server-to-server tools (Postman, curl) and mobile/native clients.
    if (!origin) return callback(null, true);
    const normalizedOrigin = normalizeOrigin(origin);

    if (allowedOrigins.has(normalizedOrigin)) return callback(null, true);
    if (env.nodeEnv !== 'production' && isLocalDevOrigin(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS blocked for this origin'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  credentials: true,
  preflightContinue: false,
  maxAge: 86400,
  optionsSuccessStatus: 200,
});
