function donutStyle(parts) {
  const values = Object.values(parts || {});
  const total = values.reduce((sum, value) => sum + Number(value || 0), 0) || 1;
  const palette = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#f43f5e', '#06b6d4'];
  let cursor = 0;
  const segments = Object.entries(parts || {}).map(([, raw], index) => {
    const value = Number(raw || 0);
    const pct = (value / total) * 100;
    const start = cursor;
    cursor += pct;
    return `${palette[index % palette.length]} ${start}% ${cursor}%`;
  });

  return {
    chart: { background: `conic-gradient(${segments.join(',')})` },
    total,
  };
}

function StatsBlock({ title, data }) {
  const { chart, total } = donutStyle(data);
  return (
    <div className="theme-chip rounded-xl p-3">
      <p className="theme-text-primary text-xs font-semibold">{title}</p>
      <div className="mt-2 flex items-center gap-3">
        <div className="h-16 w-16 rounded-full border border-[var(--theme-border)]" style={chart} />
        <div className="space-y-1 text-xs">
          {Object.entries(data || {}).slice(0, 4).map(([key, value]) => (
            <p key={key} className="theme-text-soft">
              <span className="capitalize">{key}</span>: {value} ({Math.round((Number(value || 0) / total) * 100)}%)
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DeviceStats({ devicesData }) {
  return (
    <div className="theme-surface rounded-2xl p-4">
      <h3 className="theme-text-primary text-sm font-semibold">Device & Browser Statistics</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <StatsBlock title="Devices" data={devicesData?.devices || {}} />
        <StatsBlock title="Browsers" data={devicesData?.browsers || {}} />
        <StatsBlock title="Operating Systems" data={devicesData?.os || {}} />
        <StatsBlock title="Screen Resolution" data={devicesData?.screens || {}} />
      </div>
    </div>
  );
}
