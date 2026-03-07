import fs from 'fs/promises';
import path from 'path';
import { env } from '../config/env.js';
import { projects as projectCatalog } from '../../src/data/projectsData.js';

class JSONStore {
  constructor() {
    this.dataDir = env.dataDir;
    this.contactsFile = path.join(this.dataDir, 'contacts.json');
    this.chatsFile = path.join(this.dataDir, 'chats.json');
    this.visitorsFile = path.join(this.dataDir, 'visitors.json');
    this.resumeAnalyticsFile = path.join(this.dataDir, 'resume-analytics.json');
    this.initialized = false;
  }

  async initialize() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      await this.ensureFile(this.contactsFile, []);
      await this.ensureFile(this.chatsFile, []);
      await this.ensureFile(this.visitorsFile, { totalVisits: 0, visitors: {} });
      await this.ensureFile(this.resumeAnalyticsFile, {
        totalDownloads: 0,
        byFormat: {},
        byPlacement: {},
        history: [],
      });
      this.initialized = true;
      console.log('JSON store initialized');
    } catch (error) {
      console.error('Failed to initialize JSON store:', error);
      throw error;
    }
  }

  async ensureFile(filePath, fallbackValue) {
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify(fallbackValue, null, 2));
    }
  }

  async readJson(filePath, fallbackValue) {
    if (!this.initialized) await this.initialize();
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      if (!raw.trim()) return fallbackValue;
      return JSON.parse(raw);
    } catch {
      return fallbackValue;
    }
  }

  async writeJson(filePath, value) {
    if (!this.initialized) await this.initialize();
    await fs.writeFile(filePath, JSON.stringify(value, null, 2));
  }

  async readContacts() {
    return this.readJson(this.contactsFile, []);
  }

  async writeContacts(contacts) {
    await this.writeJson(this.contactsFile, contacts);
  }

  async addContact(contact) {
    const contacts = await this.readContacts();
    contacts.push(contact);
    await this.writeContacts(contacts);
    return contact;
  }

  async getContacts(limit = 50) {
    const contacts = await this.readContacts();
    return contacts.slice(-limit).reverse();
  }

  async appendChat(record) {
    const chats = await this.readJson(this.chatsFile, []);
    chats.push(record);
    await this.writeJson(this.chatsFile, chats.slice(-500));
    return record;
  }

  async updateVisitor(ipAddress) {
    const safeIp = ipAddress || 'unknown';
    const now = new Date().toISOString();
    const state = await this.readJson(this.visitorsFile, { totalVisits: 0, visitors: {} });

    state.totalVisits = Number(state.totalVisits || 0) + 1;
    state.visitors = state.visitors || {};
    const existing = state.visitors[safeIp];

    state.visitors[safeIp] = {
      visits: Number(existing?.visits || 0) + 1,
      firstSeenAt: existing?.firstSeenAt || now,
      lastSeenAt: now,
    };

    await this.writeJson(this.visitorsFile, state);

    return {
      totalVisits: state.totalVisits,
      uniqueVisitors: Object.keys(state.visitors).length,
      currentVisitor: state.visitors[safeIp],
      updatedAt: now,
    };
  }

  async trackResumeDownload(event) {
    const now = new Date().toISOString();
    const state = await this.readJson(this.resumeAnalyticsFile, {
      totalDownloads: 0,
      byFormat: {},
      byPlacement: {},
      history: [],
    });

    const format = String(event?.format || 'unknown').toLowerCase();
    const placement = String(event?.placement || 'unknown').toLowerCase();
    const source = String(event?.source || 'unknown').toLowerCase();
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      format,
      placement,
      source,
      ip: event?.ipAddress || 'unknown',
      userAgent: event?.userAgent || 'unknown',
      ts: now,
    };

    state.totalDownloads = Number(state.totalDownloads || 0) + 1;
    state.byFormat = state.byFormat || {};
    state.byPlacement = state.byPlacement || {};
    state.history = Array.isArray(state.history) ? state.history : [];

    state.byFormat[format] = Number(state.byFormat[format] || 0) + 1;
    state.byPlacement[placement] = Number(state.byPlacement[placement] || 0) + 1;
    state.history.push(entry);
    state.history = state.history.slice(-300);

    await this.writeJson(this.resumeAnalyticsFile, state);

    return {
      totalDownloads: state.totalDownloads,
      byFormat: state.byFormat,
      byPlacement: state.byPlacement,
      lastDownload: entry,
    };
  }

  async getResumeStats() {
    const state = await this.readJson(this.resumeAnalyticsFile, {
      totalDownloads: 0,
      byFormat: {},
      byPlacement: {},
      history: [],
    });

    return {
      totalDownloads: Number(state.totalDownloads || 0),
      byFormat: state.byFormat || {},
      byPlacement: state.byPlacement || {},
      recent: Array.isArray(state.history) ? state.history.slice(-20).reverse() : [],
    };
  }
}

export const store = new JSONStore();
export const initializeStore = () => store.initialize();

export async function getProjects() {
  return projectCatalog;
}

export async function getProjectById(projectId) {
  return projectCatalog.find((item) => item.id === projectId) || null;
}

export async function saveChatRecord(record) {
  return store.appendChat({
    ...record,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  });
}

export async function trackVisitor(ipAddress) {
  return store.updateVisitor(ipAddress);
}
