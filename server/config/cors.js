import cors from 'cors';
import { env } from './env.js';

function normalizeOrigin(origin) {
  return origin?.trim().replace(/\/+$/, '');
}

const devOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
  'http://[::1]:5173',
  'http://[::1]:5174',
  'http://[::1]:3000',
];

const envOrigins = [...(env.clientOrigins || []), env.clientOrigin].map((origin) =>
  normalizeOrigin(origin),
).filter(Boolean);

const allowedOrigins = new Set(
  (env.nodeEnv === 'production' ? envOrigins : [...devOrigins, ...envOrigins])
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean),
);

function isLocalDevOrigin(origin) {
  return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(origin || '');
}

export const corsOptions = {
  origin(origin, callback) {
    // Allow server-to-server tools (Postman, curl) and native clients.
    if (!origin) return callback(null, true);
    const normalizedOrigin = normalizeOrigin(origin);

    // Browser/file contexts can send literal "null".
    if (env.nodeEnv !== 'production' && normalizedOrigin === 'null') {
      return callback(null, true);
    }

    if (allowedOrigins.has(normalizedOrigin)) return callback(null, true);
    if (env.nodeEnv !== 'production' && isLocalDevOrigin(normalizedOrigin)) {
      return callback(null, true);
    }

    const error = new Error(`CORS not allowed for origin: ${normalizedOrigin}`);
    error.statusCode = 403;

    if (env.nodeEnv !== 'production') {
      console.warn(`[CORS] Blocked origin: ${normalizedOrigin}`);
      console.warn(`[CORS] Allowed origins: ${Array.from(allowedOrigins).join(', ')}`);
    }

    return callback(error);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range', 'Content-Length', 'Content-Type'],
  credentials: true,
  preflightContinue: false,
  maxAge: 600,
  optionsSuccessStatus: 200,
};

export const corsMiddleware = cors(corsOptions);
export const resolvedCorsOrigins = Array.from(allowedOrigins);
