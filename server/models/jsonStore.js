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
    this.analyticsFile = path.join(this.dataDir, 'analytics.json');
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
      await this.ensureFile(this.analyticsFile, {
        schemaVersion: 1,
        updatedAt: new Date().toISOString(),
        sessions: {},
        events: [],
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

  createAnalyticsEventId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  periodStartIso(period) {
    const normalized = String(period || 'all').toLowerCase();
    if (normalized === 'today') {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return start.toISOString();
    }
    if (normalized === 'week') {
      return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    }
    if (normalized === 'month') {
      return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    }
    return null;
  }

  safeInteger(value, min = 0, max = Number.MAX_SAFE_INTEGER) {
    const num = Number(value);
    if (!Number.isFinite(num)) return min;
    return Math.max(min, Math.min(max, Math.round(num)));
  }

  normalizePercent(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return 0;
    return Math.max(0, Math.min(100, num));
  }

  normalizeText(value, fallback = 'unknown', maxLength = 120) {
    const str = String(value || '').trim();
    if (!str) return fallback;
    return str.slice(0, maxLength);
  }

  pruneAnalyticsState(state) {
    const safeState = {
      schemaVersion: 1,
      updatedAt: new Date().toISOString(),
      sessions: state?.sessions || {},
      events: Array.isArray(state?.events) ? state.events : [],
    };

    const now = Date.now();
    const retainAfter = now - 30 * 24 * 60 * 60 * 1000;
    const activeAfter = now - 5 * 60 * 1000;

    safeState.events = safeState.events.filter((event) => {
      const ts = Date.parse(event?.ts || '');
      return Number.isFinite(ts) && ts >= retainAfter;
    });

    const sessions = {};
    Object.entries(safeState.sessions).forEach(([sessionId, info]) => {
      const lastSeenMs = Date.parse(info?.lastSeenAt || '');
      const firstSeenMs = Date.parse(info?.firstSeenAt || '');
      if (!Number.isFinite(lastSeenMs) || !Number.isFinite(firstSeenMs)) return;
      if (lastSeenMs < retainAfter) return;
      sessions[sessionId] = {
        firstSeenAt: new Date(firstSeenMs).toISOString(),
        lastSeenAt: new Date(lastSeenMs).toISOString(),
        country: this.normalizeText(info?.country, 'unknown', 64),
        city: this.normalizeText(info?.city, 'unknown', 64),
        browser: this.normalizeText(info?.browser, 'unknown', 64),
        os: this.normalizeText(info?.os, 'unknown', 64),
        deviceType: this.normalizeText(info?.deviceType, 'unknown', 32),
        screen: this.normalizeText(info?.screen, 'unknown', 32),
        locale: this.normalizeText(info?.locale, 'unknown', 32),
        timezone: this.normalizeText(info?.timezone, 'unknown', 64),
        active: lastSeenMs >= activeAfter,
      };
    });

    safeState.sessions = sessions;
    return safeState;
  }

  async readAnalyticsState() {
    const state = await this.readJson(this.analyticsFile, {
      schemaVersion: 1,
      updatedAt: new Date().toISOString(),
      sessions: {},
      events: [],
    });
    return this.pruneAnalyticsState(state);
  }

  async writeAnalyticsState(state) {
    const pruned = this.pruneAnalyticsState(state);
    pruned.updatedAt = new Date().toISOString();
    await this.writeJson(this.analyticsFile, pruned);
    return pruned;
  }

  normalizeAnalyticsEvent(rawEvent = {}) {
    const providedTs = Date.parse(rawEvent.ts || rawEvent.timestamp || '');
    return {
      id: this.createAnalyticsEventId(),
      ts: Number.isFinite(providedTs) ? new Date(providedTs).toISOString() : new Date().toISOString(),
      sessionId: this.normalizeText(rawEvent.sessionId, 'anonymous', 72),
      eventType: this.normalizeText(rawEvent.eventType, 'unknown', 40),
      page: this.normalizeText(rawEvent.page, 'unknown', 120),
      path: this.normalizeText(rawEvent.path, 'unknown', 160),
      sectionId: this.normalizeText(rawEvent.sectionId, 'unknown', 80),
      projectId: this.normalizeText(rawEvent.projectId, 'unknown', 80),
      projectAction: this.normalizeText(rawEvent.projectAction, 'none', 40),
      dwellMs: this.safeInteger(rawEvent.dwellMs, 0, 30 * 60 * 1000),
      scrollDepth: this.normalizePercent(rawEvent.scrollDepth),
      country: this.normalizeText(rawEvent.country, 'unknown', 64),
      city: this.normalizeText(rawEvent.city, 'unknown', 64),
      region: this.normalizeText(rawEvent.region, 'unknown', 64),
      browser: this.normalizeText(rawEvent.browser, 'unknown', 64),
      os: this.normalizeText(rawEvent.os, 'unknown', 64),
      deviceType: this.normalizeText(rawEvent.deviceType, 'unknown', 32),
      screen: this.normalizeText(rawEvent.screen, 'unknown', 32),
      locale: this.normalizeText(rawEvent.locale, 'unknown', 32),
      timezone: this.normalizeText(rawEvent.timezone, 'unknown', 64),
      lat: Number.isFinite(Number(rawEvent.lat)) ? Number(rawEvent.lat) : null,
      lng: Number.isFinite(Number(rawEvent.lng)) ? Number(rawEvent.lng) : null,
      anonIpHash: this.normalizeText(rawEvent.anonIpHash, 'anonymous', 64),
      consent: rawEvent.consent === true,
      dnt: rawEvent.dnt === true,
    };
  }

  getCountryCentroid(countryCode) {
    const code = String(countryCode || '').toUpperCase();
    const centroids = {
      US: { lat: 39.8, lng: -98.5 },
      CA: { lat: 56.1, lng: -106.3 },
      GB: { lat: 55.3, lng: -3.4 },
      DE: { lat: 51.1, lng: 10.4 },
      FR: { lat: 46.2, lng: 2.2 },
      ET: { lat: 9.1, lng: 40.5 },
      IN: { lat: 22.6, lng: 79.0 },
      CN: { lat: 35.9, lng: 104.2 },
      BR: { lat: -14.2, lng: -51.9 },
      AU: { lat: -25.3, lng: 133.8 },
      ZA: { lat: -30.6, lng: 22.9 },
      NG: { lat: 9.1, lng: 8.7 },
      KE: { lat: -0.02, lng: 37.9 },
      EG: { lat: 26.8, lng: 30.8 },
      SA: { lat: 23.8, lng: 45.1 },
      AE: { lat: 24.2, lng: 54.4 },
      SE: { lat: 60.1, lng: 18.6 },
      NO: { lat: 60.5, lng: 8.5 },
      NL: { lat: 52.1, lng: 5.3 },
      ES: { lat: 40.4, lng: -3.7 },
    };
    return centroids[code] || null;
  }

  async trackAnalytics(payload = {}) {
    const state = await this.readAnalyticsState();
    const events = Array.isArray(payload?.events) ? payload.events : [];
    const acceptedEvents = [];

    for (const item of events.slice(0, 50)) {
      const event = this.normalizeAnalyticsEvent(item);
      if (event.dnt || !event.consent) continue;
      acceptedEvents.push(event);
      state.events.push(event);

      state.sessions[event.sessionId] = {
        ...(state.sessions[event.sessionId] || {}),
        firstSeenAt: state.sessions[event.sessionId]?.firstSeenAt || event.ts,
        lastSeenAt: event.ts,
        country: event.country,
        city: event.city,
        browser: event.browser,
        os: event.os,
        deviceType: event.deviceType,
        screen: event.screen,
        locale: event.locale,
        timezone: event.timezone,
      };
    }

    const updated = await this.writeAnalyticsState(state);
    return {
      accepted: acceptedEvents.length,
      activeVisitors: this.getActiveVisitorsCount(updated),
      totalUniqueVisitors: Object.keys(updated.sessions || {}).length,
      updatedAt: updated.updatedAt,
    };
  }

  getFilteredEvents(state, period = 'all') {
    const startIso = this.periodStartIso(period);
    const events = Array.isArray(state?.events) ? state.events : [];
    if (!startIso) return events;
    const startMs = Date.parse(startIso);
    return events.filter((event) => {
      const ts = Date.parse(event?.ts || '');
      return Number.isFinite(ts) && ts >= startMs;
    });
  }

  getActiveVisitorsCount(state) {
    const now = Date.now();
    const activeAfter = now - 5 * 60 * 1000;
    return Object.values(state?.sessions || {}).filter((session) => {
      const lastSeenMs = Date.parse(session?.lastSeenAt || '');
      return Number.isFinite(lastSeenMs) && lastSeenMs >= activeAfter;
    }).length;
  }

  async getAnalyticsVisitors() {
    const state = await this.readAnalyticsState();
    const sessions = state.sessions || {};
    const totalUniqueVisitors = Object.keys(sessions).length;
    const activeVisitors = this.getActiveVisitorsCount(state);

    const todayStart = this.periodStartIso('today');
    const todayStartMs = Date.parse(todayStart);
    const todayVisitors = Object.values(sessions).filter((session) => {
      const lastSeenMs = Date.parse(session?.lastSeenAt || '');
      return Number.isFinite(lastSeenMs) && lastSeenMs >= todayStartMs;
    }).length;

    return {
      activeVisitors,
      totalUniqueVisitors,
      todayVisitors,
      updatedAt: state.updatedAt,
    };
  }

  async getAnalyticsLocations(period = 'all') {
    const state = await this.readAnalyticsState();
    const events = this.getFilteredEvents(state, period).filter((event) =>
      ['location_ping', 'page_view'].includes(event.eventType),
    );
    const byCountry = {};
    const byCity = {};
    const pointsMap = {};

    for (const event of events) {
      const country = event.country || 'unknown';
      const city = event.city || 'unknown';
      const countryKey = country.toUpperCase();
      const cityKey = `${countryKey}:${city.toLowerCase()}`;

      byCountry[countryKey] = byCountry[countryKey] || {
        country: countryKey,
        visitors: 0,
        lat: event.lat,
        lng: event.lng,
      };
      byCountry[countryKey].visitors += 1;
      if (byCountry[countryKey].lat === null && event.lat !== null) byCountry[countryKey].lat = event.lat;
      if (byCountry[countryKey].lng === null && event.lng !== null) byCountry[countryKey].lng = event.lng;

      if (event.lat !== null && event.lng !== null) {
        const pointKey = `${event.lat.toFixed(2)}:${event.lng.toFixed(2)}`;
        pointsMap[pointKey] = pointsMap[pointKey] || {
          lat: Number(event.lat.toFixed(4)),
          lng: Number(event.lng.toFixed(4)),
          visitors: 0,
          country: countryKey,
          city,
        };
        pointsMap[pointKey].visitors += 1;
      }

      byCity[cityKey] = byCity[cityKey] || {
        country: countryKey,
        city,
        visitors: 0,
      };
      byCity[cityKey].visitors += 1;
    }

    Object.values(byCountry).forEach((row) => {
      if (row.lat !== null && row.lng !== null) return;
      const centroid = this.getCountryCentroid(row.country);
      if (!centroid) return;
      row.lat = centroid.lat;
      row.lng = centroid.lng;
      const key = `${centroid.lat.toFixed(2)}:${centroid.lng.toFixed(2)}`;
      pointsMap[key] = pointsMap[key] || {
        lat: centroid.lat,
        lng: centroid.lng,
        visitors: 0,
        country: row.country,
        city: 'unknown',
      };
      pointsMap[key].visitors += row.visitors;
    });

    return {
      countries: Object.values(byCountry).sort((a, b) => b.visitors - a.visitors),
      cities: Object.values(byCity).sort((a, b) => b.visitors - a.visitors).slice(0, 30),
      points: Object.values(pointsMap).sort((a, b) => b.visitors - a.visitors).slice(0, 400),
      updatedAt: state.updatedAt,
    };
  }

  async getAnalyticsSections(period = 'all') {
    const state = await this.readAnalyticsState();
    const events = this.getFilteredEvents(state, period).filter((event) => event.eventType === 'section_engagement');
    const grouped = {};

    for (const event of events) {
      const key = event.sectionId || 'unknown';
      grouped[key] = grouped[key] || {
        sectionId: key,
        totalTimeMs: 0,
        views: 0,
        avgScrollDepth: 0,
        totalScrollDepth: 0,
      };
      grouped[key].totalTimeMs += this.safeInteger(event.dwellMs, 0, 30 * 60 * 1000);
      grouped[key].views += 1;
      grouped[key].totalScrollDepth += this.normalizePercent(event.scrollDepth);
    }

    const sections = Object.values(grouped).map((item) => ({
      sectionId: item.sectionId,
      views: item.views,
      totalTimeMs: item.totalTimeMs,
      averageTimeMs: item.views ? Math.round(item.totalTimeMs / item.views) : 0,
      avgScrollDepth: item.views ? Number((item.totalScrollDepth / item.views).toFixed(1)) : 0,
    }));

    return {
      sections: sections.sort((a, b) => b.averageTimeMs - a.averageTimeMs),
      mostEngagingSection: sections.sort((a, b) => b.averageTimeMs - a.averageTimeMs)[0] || null,
      updatedAt: state.updatedAt,
    };
  }

  async getAnalyticsProjects(period = 'all') {
    const state = await this.readAnalyticsState();
    const events = this.getFilteredEvents(state, period);
    const grouped = {};

    for (const event of events) {
      const projectId = event.projectId;
      if (!projectId || projectId === 'unknown') continue;
      grouped[projectId] = grouped[projectId] || {
        projectId,
        views: 0,
        githubClicks: 0,
        liveDemoClicks: 0,
      };

      if (event.eventType === 'project_view') grouped[projectId].views += 1;
      if (event.eventType === 'project_click' && event.projectAction === 'github') grouped[projectId].githubClicks += 1;
      if (event.eventType === 'project_click' && event.projectAction === 'demo') grouped[projectId].liveDemoClicks += 1;
    }

    const rows = Object.values(grouped).map((item) => ({
      ...item,
      totalInteractions: item.views + item.githubClicks + item.liveDemoClicks,
    }));

    return {
      period: String(period || 'all').toLowerCase(),
      projects: rows.sort((a, b) => b.totalInteractions - a.totalInteractions),
      updatedAt: state.updatedAt,
    };
  }

  async getAnalyticsDevices(period = 'all') {
    const state = await this.readAnalyticsState();
    const events = this.getFilteredEvents(state, period).filter((event) => event.eventType === 'page_view');

    const devices = {};
    const browsers = {};
    const os = {};
    const screens = {};

    for (const event of events) {
      devices[event.deviceType] = Number(devices[event.deviceType] || 0) + 1;
      browsers[event.browser] = Number(browsers[event.browser] || 0) + 1;
      os[event.os] = Number(os[event.os] || 0) + 1;
      screens[event.screen] = Number(screens[event.screen] || 0) + 1;
    }

    return {
      devices,
      browsers,
      os,
      screens,
      updatedAt: state.updatedAt,
    };
  }

  async getAnalyticsDashboard(period = 'all') {
    const [visitorsResult, locationsResult, sectionsResult, projectsResult, devicesResult] = await Promise.allSettled([
      this.getAnalyticsVisitors(),
      this.getAnalyticsLocations(period),
      this.getAnalyticsSections(period),
      this.getAnalyticsProjects(period),
      this.getAnalyticsDevices(period),
    ]);

    const visitors = visitorsResult.status === 'fulfilled'
      ? visitorsResult.value
      : {
          activeVisitors: 0,
          totalUniqueVisitors: 0,
          todayVisitors: 0,
          updatedAt: new Date().toISOString(),
        };

    const locations = locationsResult.status === 'fulfilled'
      ? locationsResult.value
      : {
          countries: [],
          cities: [],
          points: [],
          updatedAt: new Date().toISOString(),
        };

    const sections = sectionsResult.status === 'fulfilled'
      ? sectionsResult.value
      : {
          sections: [],
          mostEngagingSection: null,
          updatedAt: new Date().toISOString(),
        };

    const projects = projectsResult.status === 'fulfilled'
      ? projectsResult.value
      : {
          period: String(period || 'all').toLowerCase(),
          projects: [],
          updatedAt: new Date().toISOString(),
        };

    const devices = devicesResult.status === 'fulfilled'
      ? devicesResult.value
      : {
          devices: {},
          browsers: {},
          os: {},
          screens: {},
          updatedAt: new Date().toISOString(),
        };

    return {
      period: String(period || 'all').toLowerCase(),
      visitors,
      locations,
      sections,
      projects,
      devices,
      updatedAt: new Date().toISOString(),
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
