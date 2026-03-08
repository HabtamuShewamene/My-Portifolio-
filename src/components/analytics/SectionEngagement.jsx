function formatMs(value) {
  const seconds = Math.round((Number(value || 0) / 1000));
  if (seconds < 60) return `${seconds}s`;
  const min = Math.floor(seconds / 60);
  const rem = seconds % 60;
  return `${min}m ${rem}s`;
}

export default function SectionEngagement({ sectionsData }) {
  const rows = sectionsData?.sections || [];
  const maxTime = Math.max(1, ...rows.map((item) => item.averageTimeMs || 0));

  return (
    <div className="theme-surface rounded-2xl p-4">
      <h3 className="theme-text-primary text-sm font-semibold">Section Engagement</h3>
      <div className="mt-3 space-y-3">
        {rows.length === 0 && <p className="theme-text-soft text-sm">No section analytics yet.</p>}
        {rows.map((item) => (
          <div key={item.sectionId}>
            <div className="flex items-center justify-between text-xs">
              <span className="theme-text-primary capitalize">{item.sectionId}</span>
              <span className="theme-text-soft">Avg {formatMs(item.averageTimeMs)} • Scroll {item.avgScrollDepth}%</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-slate-500/20">
              <div
                className="h-2 rounded-full bg-[linear-gradient(90deg,#3b82f6,#8b5cf6)]"
                style={{ width: `${Math.max(6, Math.round((item.averageTimeMs / maxTime) * 100))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
