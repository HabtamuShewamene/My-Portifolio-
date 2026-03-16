import { useMemo } from 'react';

function createCsv(rows = []) {
  const header = 'projectId,views,githubClicks,liveDemoClicks,totalInteractions';
  const body = rows
    .map((item) => [
      item.projectId,
      item.views || 0,
      item.githubClicks || 0,
      item.liveDemoClicks || 0,
      item.totalInteractions || 0,
    ].join(','))
    .join('\n');
  return `${header}\n${body}`;
}

export default function ProjectsRanking({ projectsData, period, onPeriodChange }) {
  const rows = useMemo(() => projectsData?.projects || [], [projectsData]);

  const exportCsv = () => {
    const csv = createCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `projects-ranking-${period}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.setTimeout(() => URL.revokeObjectURL(url), 1200);
  };

  const max = useMemo(() => Math.max(1, ...rows.map((item) => item.totalInteractions || 0)), [rows]);

  return (
    <div className="theme-surface rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="theme-text-primary text-sm font-semibold">Most Viewed Projects</h3>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(event) => onPeriodChange?.(event.target.value)}
            className="theme-input rounded-md border px-2 py-1 text-xs"
          >
            <option value="today">Today</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="all">All-time</option>
          </select>
          <button type="button" className="theme-button-secondary rounded-md px-2 py-1 text-xs" onClick={exportCsv}>
            Export CSV
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {rows.length === 0 && <p className="theme-text-soft text-sm">No project interactions yet.</p>}
        {rows.map((item, index) => (
          <div key={item.projectId} className="theme-chip rounded-lg p-2 text-xs">
            <div className="mb-1 flex items-center justify-between">
              <span className="theme-text-primary">#{index + 1} {item.projectId}</span>
              <span>{item.totalInteractions}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-500/20">
              <div
                className="h-2 rounded-full bg-[linear-gradient(90deg,#3b82f6,#8b5cf6)]"
                style={{ width: `${Math.max(8, Math.round((item.totalInteractions / max) * 100))}%` }}
              />
            </div>
            <div className="mt-1 flex gap-3">
              <span>Views: {item.views}</span>
              <span>GitHub: {item.githubClicks}</span>
              <span>Demo: {item.liveDemoClicks}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
