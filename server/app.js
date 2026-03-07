import express from 'express';
import helmet from 'helmet';
import { corsMiddleware } from './config/cors.js';
import apiRoutes from './routes/index.js';
import { sanitizeInput } from './middleware/sanitizeInput.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.options('*', corsMiddleware);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(sanitizeInput);

app.use('/api', apiRoutes);

app.get('/api/test', (req, res) => {
  res.json({
    ok: true,
    message: 'CORS is working',
    origin: req.headers.origin || 'No origin',
    timestamp: new Date().toISOString(),
  });
});

app.use((err, req, res, next) => {
  if (err?.statusCode === 403 && err?.message?.includes('CORS not allowed')) {
    return res.status(403).json({
      ok: false,
      message: 'CORS blocked for this origin',
      origin: req.headers.origin || null,
    });
  }
  return next(err);
});

app.use(notFound);
app.use(errorHandler);

export default app;
