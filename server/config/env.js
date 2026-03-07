import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverRoot = path.resolve(__dirname, '..');
const projectRoot = path.resolve(serverRoot, '..');
const serverEnvPath = path.join(serverRoot, '.env');
const rootEnvPath = path.join(projectRoot, '.env');

if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  console.warn('No .env file found.');
}

function resolveRuntimePath(rawPath, fallbackRelativeToServer) {
  const value = String(rawPath || '').trim();
  if (!value) return path.resolve(serverRoot, fallbackRelativeToServer);
  if (path.isAbsolute(value)) return value;

  // Accept legacy values like "server/data" as project-root-relative.
  if (/^server[\\/]/i.test(value)) {
    return path.resolve(projectRoot, value);
  }
  return path.resolve(serverRoot, value);
}

export const env = {
  port: Number.parseInt(process.env.PORT || '5000', 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  trustProxy: process.env.TRUST_PROXY === 'true',

  email: {
    user: process.env.CONTACT_EMAIL_USER,
    pass: process.env.CONTACT_EMAIL_PASS,
    to: process.env.CONTACT_EMAIL_TO || process.env.CONTACT_EMAIL_USER,
    get configured() {
      return Boolean(this.user && this.pass);
    },
  },

  rateLimits: {
    contact: {
      max: Number.parseInt(process.env.CONTACT_RATE_LIMIT_MAX || '5', 10) || 5,
      windowMs: Number.parseInt(process.env.CONTACT_RATE_LIMIT_WINDOW_MS || '3600000', 10) || 3600000,
    },
    chat: {
      max: Number.parseInt(process.env.CHAT_RATE_LIMIT_MAX || '40', 10) || 40,
      windowMs: Number.parseInt(process.env.CHAT_RATE_LIMIT_WINDOW_MS || '900000', 10) || 900000,
    },
  },

  github: {
    username: process.env.GITHUB_USERNAME || 'habtamu-shewamene',
    repo: process.env.GITHUB_REPO || 'my-portfolio',
  },

  linkedinFollowers: process.env.LINKEDIN_FOLLOWERS || '500',
  dataDir: resolveRuntimePath(process.env.DATA_DIR, 'data'),
  backupDir: resolveRuntimePath(process.env.BACKUP_DIR, 'backups'),
};

