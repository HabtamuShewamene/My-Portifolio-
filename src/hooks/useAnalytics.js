import { useContext, useEffect, useRef } from 'react';
import { AnalyticsContext } from '../context/AnalyticsContext.jsx';

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used inside AnalyticsProvider');
  }
  return context;
}

export function useTrackPageView(pageName = 'portfolio-home') {
  const { trackEvent } = useAnalytics();
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;
    trackEvent({ eventType: 'page_view', page: pageName });
  }, [trackEvent, pageName]);
}

export function useTrackSectionEngagement(sectionIds = []) {
  const { trackEvent } = useAnalytics();
  const sectionStateRef = useRef({});

  useEffect(() => {
    if (!Array.isArray(sectionIds) || !sectionIds.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const now = Date.now();

        entries.forEach((entry) => {
          const sectionId = entry.target?.id;
          if (!sectionId) return;
          const current = sectionStateRef.current[sectionId] || { inViewAt: null, maxRatio: 0 };

          if (entry.isIntersecting) {
            if (!current.inViewAt) current.inViewAt = now;
            current.maxRatio = Math.max(current.maxRatio || 0, entry.intersectionRatio || 0);
            sectionStateRef.current[sectionId] = current;
            return;
          }

          if (current.inViewAt) {
            const dwellMs = Math.max(0, now - current.inViewAt);
            trackEvent({
              eventType: 'section_engagement',
              sectionId,
              dwellMs,
              scrollDepth: Math.round((current.maxRatio || 0) * 100),
            });
            sectionStateRef.current[sectionId] = { inViewAt: null, maxRatio: 0 };
          }
        });
      },
      { threshold: [0.2, 0.4, 0.6, 0.8] },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const flushVisibleSections = () => {
      const now = Date.now();
      Object.entries(sectionStateRef.current).forEach(([sectionId, state]) => {
        if (!state?.inViewAt) return;
        trackEvent({
          eventType: 'section_engagement',
          sectionId,
          dwellMs: Math.max(0, now - state.inViewAt),
          scrollDepth: Math.round((state.maxRatio || 0) * 100),
        });
      });
      sectionStateRef.current = {};
    };

    document.addEventListener('visibilitychange', flushVisibleSections);
    window.addEventListener('beforeunload', flushVisibleSections);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', flushVisibleSections);
      window.removeEventListener('beforeunload', flushVisibleSections);
      flushVisibleSections();
    };
  }, [sectionIds, trackEvent]);
}
