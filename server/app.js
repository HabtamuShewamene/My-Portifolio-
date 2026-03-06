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
app.use(express.json());
app.use(sanitizeInput);

app.use('/api', apiRoutes);

app.get('/api/test', (req, res) => {
  res.json({ ok: true, message: 'Server is running' });
});

app.use(notFound);
app.use(errorHandler);

export default app;
