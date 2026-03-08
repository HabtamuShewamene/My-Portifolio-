import { lazy, Suspense } from 'react';
import ShimmerSkeleton from '../ui/ShimmerSkeleton.jsx';
import { useAnalytics } from '../../hooks/useAnalytics.js';
import VisitorCounter from './VisitorCounter.jsx';

const WorldMap = lazy(() => import('./WorldMap.jsx'));
const SectionEngagement = lazy(() => import('./SectionEngagement.jsx'));
const ProjectsRanking = lazy(() => import('./ProjectsRanking.jsx'));
const DeviceStats = lazy(() => import('./DeviceStats.jsx'));

function ChartSkeleton({ className = 'h-64' }) {
  return <ShimmerSkeleton className={className} />;
}

export default function AnalyticsDashboard() {
  const {
    dashboard,
    visitors,
    loading,
    error,
    period,
    setPeriod,
    refreshDashboard,
    consent,
    setConsent,
    optOut,
    setOptOut,
    dnt,
    canTrack,
  } = useAnalytics();

  const exportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      period,
      dashboard,
      visitors,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `analytics-dashboard-${period}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(() => URL.revokeObjectURL(url), 1400);
  };

  return (
    <div className="space-y-5">
      <section className="theme-surface rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="theme-text-primary font-heading text-2xl font-semibold">Visitor Analytics Dashboard</h2>
            <p className="theme-text-soft mt-1 text-sm">Anonymous, consent-based analytics with 30-day retention.</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="theme-input rounded-md border px-2 py-1 text-xs"
            >
              <option value="today">Today</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="all">All-time</option>
            </select>
            <button type="button" className="theme-button-secondary rounded-md px-3 py-1.5 text-xs" onClick={() => refreshDashboard(period)}>
              Refresh
            </button>
            <button type="button" className="theme-button-secondary rounded-md px-3 py-1.5 text-xs" onClick={exportJson}>
              Export JSON
            </button>
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <label className="theme-chip flex items-center gap-2 rounded-lg px-3 py-2 text-xs">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            Analytics consent
          </label>
          <label className="theme-chip flex items-center gap-2 rounded-lg px-3 py-2 text-xs">
            <input type="checkbox" checked={optOut} onChange={(event) => setOptOut(event.target.checked)} />
            Opt-out tracking
          </label>
          <div className="theme-chip rounded-lg px-3 py-2 text-xs">
            DNT: <strong>{dnt ? 'Enabled' : 'Disabled'}</strong> • Tracking: <strong>{canTrack ? 'On' : 'Off'}</strong>
          </div>
        </div>
      </section>

      {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}

      {loading && !dashboard ? (
        <div className="grid gap-4">
          <ChartSkeleton className="h-24" />
          <ChartSkeleton className="h-72" />
          <ChartSkeleton className="h-72" />
        </div>
      ) : (
        <>
          <VisitorCounter visitors={visitors || dashboard?.visitors} />

          <div className="grid gap-4 lg:grid-cols-2">
            <Suspense fallback={<ChartSkeleton className="h-[420px]" />}>
              <WorldMap locations={dashboard?.locations} />
            </Suspense>
            <Suspense fallback={<ChartSkeleton className="h-[420px]" />}>
              <SectionEngagement sectionsData={dashboard?.sections} />
            </Suspense>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Suspense fallback={<ChartSkeleton className="h-[420px]" />}>
              <ProjectsRanking
                projectsData={dashboard?.projects}
                period={period}
                onPeriodChange={setPeriod}
              />
            </Suspense>
            <Suspense fallback={<ChartSkeleton className="h-[420px]" />}>
              <DeviceStats devicesData={dashboard?.devices} />
            </Suspense>
          </div>
        </>
      )}
    </div>
  );
}
