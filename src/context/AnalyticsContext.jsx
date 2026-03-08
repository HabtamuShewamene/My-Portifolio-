import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchAnalyticsDashboard,
  fetchAnalyticsVisitors,
  trackAnalyticsLocation,
  trackAnalyticsEvents,
} from '../services/api.js';

export const ANALYTICS_CONSENT_KEY = 'portfolio_analytics_consent';
export const ANALYTICS_OPT_OUT_KEY = 'portfolio_analytics_opt_out';
const SESSION_KEY = 'portfolio_analytics_session_id';
const LOCATION_LAST_SENT_KEY = 'portfolio_analytics_location_last_sent';

function createSessionId() {
  const random = Math.random().toString(36).slice(2, 10);
  return `sess_${Date.now()}_${random}`;
}

function getSessionId() {
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const created = createSessionId();
  window.localStorage.setItem(SESSION_KEY, created);
  return created;
}

function detectDeviceType() {
  const width = window.innerWidth || 0;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function detectBrowser() {
  const ua = navigator.userAgent || '';
  if (/Edg\//i.test(ua)) return 'edge';
  if (/Firefox\//i.test(ua)) return 'firefox';
  if (/Chrome\//i.test(ua)) return 'chrome';
  if (/Safari\//i.test(ua)) return 'safari';
  return 'unknown';
}

function detectOs() {
  const ua = navigator.userAgent || '';
  if (/Windows/i.test(ua)) return 'windows';
  if (/Mac OS X/i.test(ua)) return 'macos';
  if (/Android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Linux/i.test(ua)) return 'linux';
  return 'unknown';
}

function detectCountryFromLocale(localeValue) {
  const parts = String(localeValue || '').split('-');
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'UNKNOWN';
}

function readBooleanStorage(key, fallback = false) {
  const value = window.localStorage.getItem(key);
  if (value === null) return fallback;
  return value === 'true';
}

export const AnalyticsContext = createContext(null);

export function AnalyticsProvider({ children }) {
  const [dashboard, setDashboard] = useState(null);
  const [visitors, setVisitors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('all');
  const [consent, setConsentState] = useState(() => readBooleanStorage(ANALYTICS_CONSENT_KEY, false));
  const [optOut, setOptOutState] = useState(() => readBooleanStorage(ANALYTICS_OPT_OUT_KEY, false));

  const queueRef = useRef([]);
  const flushTimerRef = useRef(null);
  const locationPingInFlightRef = useRef(false);

  const dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1';
  const sessionId = useMemo(() => getSessionId(), []);
  const runtimeMeta = useMemo(() => {
    const locale = navigator.language || 'unknown';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown';
    return {
      sessionId,
      locale,
      timezone,
      country: detectCountryFromLocale(locale),
      city: 'unknown',
      region: 'unknown',
      browser: detectBrowser(),
      os: detectOs(),
      deviceType: detectDeviceType(),
      screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    };
  }, [sessionId]);

  const canTrack = consent && !optOut && !dnt;

  const refreshDashboard = useCallback(async (nextPeriod = period) => {
    setLoading(true);
    setError('');
    try {
      const [dashboardData, visitorData] = await Promise.all([
        fetchAnalyticsDashboard(nextPeriod),
        fetchAnalyticsVisitors(),
      ]);
      setDashboard(dashboardData);
      setVisitors(visitorData);
    } catch (err) {
      setError(err?.message || 'Failed to load analytics dashboard.');
    } finally {
      setLoading(false);
    }
  }, [period]);

  const flushQueue = useCallback(async () => {
    if (!canTrack) {
      queueRef.current = [];
      return;
    }

    const events = queueRef.current.slice(0, 50);
    if (!events.length) return;

    queueRef.current = queueRef.current.slice(events.length);

    try {
      await trackAnalyticsEvents(events);
    } catch {
      queueRef.current = [...events, ...queueRef.current].slice(0, 300);
    }
  }, [canTrack]);

  const trackEvent = useCallback((event) => {
    if (!event || typeof event !== 'object') return;

    const payload = {
      ...runtimeMeta,
      ...event,
      page: event.page || document.title || 'portfolio',
      path: event.path || window.location.pathname,
      consent,
      dnt,
    };

    queueRef.current.push(payload);
    queueRef.current = queueRef.current.slice(-300);

    if (!flushTimerRef.current) {
      flushTimerRef.current = window.setTimeout(async () => {
        flushTimerRef.current = null;
        await flushQueue();
      }, 6000);
    }
  }, [runtimeMeta, consent, dnt, flushQueue]);

  const setConsent = useCallback((value) => {
    const next = Boolean(value);
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, String(next));
    setConsentState(next);
  }, []);

  const setOptOut = useCallback((value) => {
    const next = Boolean(value);
    window.localStorage.setItem(ANALYTICS_OPT_OUT_KEY, String(next));
    setOptOutState(next);
  }, []);

  useEffect(() => {
    refreshDashboard(period);
  }, [period, refreshDashboard]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      refreshDashboard(period);
      flushQueue();
    }, 10000);
    return () => {
      window.clearInterval(interval);
    };
  }, [period, refreshDashboard, flushQueue]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushQueue();
      }
    };
    const onUnload = () => {
      flushQueue();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('beforeunload', onUnload);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [flushQueue]);

  useEffect(() => {
    if (!canTrack || locationPingInFlightRef.current) return;

    const lastSentMs = Number(window.localStorage.getItem(LOCATION_LAST_SENT_KEY) || 0);
    const elapsed = Date.now() - lastSentMs;
    if (elapsed < 10 * 60 * 1000) return;

    const sendLocationPing = async (coords = null) => {
      locationPingInFlightRef.current = true;
      try {
        await trackAnalyticsLocation({
          lat: coords?.lat ?? null,
          lng: coords?.lng ?? null,
          city: 'unknown',
          country: runtimeMeta.country,
          countryCode: runtimeMeta.country,
          sessionId,
          consent,
          dnt,
          page: document.title || 'portfolio-home',
          path: window.location.pathname,
          timestamp: new Date().toISOString(),
        });
        window.localStorage.setItem(LOCATION_LAST_SENT_KEY, String(Date.now()));
      } finally {
        locationPingInFlightRef.current = false;
      }
    };

    if (!('geolocation' in navigator)) {
      sendLocationPing();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        sendLocationPing({
          lat: Number(position?.coords?.latitude),
          lng: Number(position?.coords?.longitude),
        });
      },
      () => {
        sendLocationPing();
      },
      {
        enableHighAccuracy: false,
        timeout: 6000,
        maximumAge: 10 * 60 * 1000,
      },
    );
  }, [canTrack, consent, dnt, runtimeMeta.country, sessionId]);

  const value = useMemo(() => ({
    dashboard,
    visitors,
    loading,
    error,
    period,
    setPeriod,
    refreshDashboard,
    trackEvent,
    flushQueue,
    consent,
    setConsent,
    optOut,
    setOptOut,
    dnt,
    canTrack,
    sessionId,
  }), [
    dashboard,
    visitors,
    loading,
    error,
    period,
    refreshDashboard,
    trackEvent,
    flushQueue,
    consent,
    setConsent,
    optOut,
    setOptOut,
    dnt,
    canTrack,
    sessionId,
  ]);

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}
