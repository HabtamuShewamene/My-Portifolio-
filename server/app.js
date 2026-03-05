import express from 'express';
import helmet from 'helmet';
import apiRoutes from './routes/index.js';
import { corsMiddleware } from './config/cors.js';
import { sanitizeInput } from './middleware/sanitizeInput.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json({ limit: '1mb' }));
app.use(sanitizeInput);

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
