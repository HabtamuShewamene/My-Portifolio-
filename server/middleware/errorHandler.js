import { env } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  if (env.nodeEnv !== 'test') {
    console.error('[API ERROR]', err);
  }

  res.status(status).json({
    ok: false,
    message: err.message || 'Internal server error',
    ...(env.nodeEnv === 'development' ? { stack: err.stack } : {}),
  });
}
