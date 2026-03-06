// server/config/env.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Look for .env in the server folder first (where we know it exists)
const serverEnvPath = path.join(__dirname, '../.env');
const rootEnvPath = path.join(__dirname, '../../.env');

console.log('🔍 Looking for .env files:');
console.log(`   Server .env: ${serverEnvPath} (${fs.existsSync(serverEnvPath) ? '✅' : '❌'})`);
console.log(`   Root .env: ${rootEnvPath} (${fs.existsSync(rootEnvPath) ? '✅' : '❌'})`);

// Load from server folder first
if (fs.existsSync(serverEnvPath)) {
  console.log('📁 Loading .env from server folder');
  dotenv.config({ path: serverEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  console.log('📁 Loading .env from root folder');
  dotenv.config({ path: rootEnvPath });
} else {
  console.warn('⚠️  No .env file found!');
}

// Debug: Check what was loaded
console.log('📧 After loading:');
console.log('   CONTACT_EMAIL_USER:', process.env.CONTACT_EMAIL_USER ? '✅ Found' : '❌ Missing');
console.log('   CONTACT_EMAIL_PASS:', process.env.CONTACT_EMAIL_PASS ? '✅ Found' : '❌ Missing');

export const env = {
  // Server
  port: parseInt(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  trustProxy: process.env.TRUST_PROXY === 'true',

  // Email Configuration
  email: {
    user: process.env.CONTACT_EMAIL_USER,
    pass: process.env.CONTACT_EMAIL_PASS,
    to: process.env.CONTACT_EMAIL_TO || process.env.CONTACT_EMAIL_USER,
    get configured() {
      return !!(this.user && this.pass);
    }
  },

  // Rate Limiting
  rateLimits: {
    contact: {
      max: parseInt(process.env.CONTACT_RATE_LIMIT_MAX) || 5,
      windowMs: parseInt(process.env.CONTACT_RATE_LIMIT_WINDOW_MS) || 3600000
    },
    chat: {
      max: parseInt(process.env.CHAT_RATE_LIMIT_MAX) || 40,
      windowMs: parseInt(process.env.CHAT_RATE_LIMIT_WINDOW_MS) || 900000
    }
  },

  // Social & GitHub
  github: {
    username: process.env.GITHUB_USERNAME || 'habtamu-shewamene',
    repo: process.env.GITHUB_REPO || 'my-portfolio'
  },
  
  linkedinFollowers: process.env.LINKEDIN_FOLLOWERS || '500',

  // Paths
  dataDir: process.env.DATA_DIR || path.join(__dirname, '../data'),
  backupDir: process.env.BACKUP_DIR || path.join(__dirname, '../backups'),
};
