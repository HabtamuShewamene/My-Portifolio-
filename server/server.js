import app from './app.js';
import { env } from './config/env.js';
import { resolvedCorsOrigins } from './config/cors.js';
import { initializeStore } from './models/jsonStore.js';

function listenAsync(port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => resolve(server));
    server.on('error', reject);
  });
}

async function listenWithFallback(basePort) {
  let port = Number(basePort);
  const maxAttempts = env.nodeEnv === 'production' ? 1 : 10;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      await listenAsync(port);
      return port;
    } catch (error) {
      if (error?.code !== 'EADDRINUSE' || attempt === maxAttempts - 1) {
        throw error;
      }
      console.warn(`Port ${port} is in use. Trying ${port + 1}...`);
      port += 1;
    }
  }

  throw new Error('No available port found.');
}

async function startServer() {
  await initializeStore();

  if (env.trustProxy) {
    app.set('trust proxy', 1);
  }

  const runningPort = await listenWithFallback(env.port);
  console.log(`Server listening on http://localhost:${runningPort}`);
  console.log(`CORS enabled for: ${resolvedCorsOrigins.join(', ')}`);
  console.log(`CORS test endpoint: http://localhost:${runningPort}/api/test`);
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
