import { useMemo, useState } from 'react';

function countryFlag(countryCode) {
  const code = String(countryCode || 'UN').toUpperCase();
  if (code.length !== 2) return '🏳';
  const first = code.codePointAt(0) + 127397;
  const second = code.codePointAt(1) + 127397;
  return String.fromCodePoint(first, second);
}

function project(lat, lng) {
  const width = 820;
  const height = 420;
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

export default function WorldMap({ locations }) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragState, setDragState] = useState(null);

  const points = useMemo(() => {
    const countries = Array.isArray(locations?.countries) ? locations.countries : [];
    return countries
      .filter((item) => Number.isFinite(item?.lat) && Number.isFinite(item?.lng))
      .slice(0, 200)
      .map((item) => {
        const { x, y } = project(item.lat, item.lng);
        return {
          ...item,
          x,
          y,
          radius: Math.max(3, Math.min(18, Math.sqrt(item.visitors || 1) * 2)),
        };
      });
  }, [locations]);

  return (
    <div className="theme-surface rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="theme-text-primary text-sm font-semibold">Geographic Heat Map</h3>
        <div className="flex items-center gap-2 text-xs">
          <button type="button" className="theme-chip rounded px-2 py-1" onClick={() => setZoom((z) => Math.max(1, z - 0.2))}>-</button>
          <span className="theme-text-soft">{zoom.toFixed(1)}x</span>
          <button type="button" className="theme-chip rounded px-2 py-1" onClick={() => setZoom((z) => Math.min(3, z + 0.2))}>+</button>
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-xl border border-[var(--theme-border)]"
        onWheel={(event) => {
          event.preventDefault();
          const delta = event.deltaY > 0 ? -0.1 : 0.1;
          setZoom((z) => Math.max(1, Math.min(3, z + delta)));
        }}
        onPointerDown={(event) => {
          setDragState({ x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y });
        }}
        onPointerMove={(event) => {
          if (!dragState) return;
          setOffset({
            x: dragState.ox + (event.clientX - dragState.x),
            y: dragState.oy + (event.clientY - dragState.y),
          });
        }}
        onPointerUp={() => setDragState(null)}
      >
        <svg viewBox="0 0 820 420" className="h-[320px] w-full bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.14),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.2),transparent_45%)]">
          <g transform={`translate(${offset.x}, ${offset.y}) scale(${zoom})`}>
            <rect x="0" y="0" width="820" height="420" fill="transparent" />
            <path d="M30 200 C160 120, 240 120, 320 180 C390 230, 460 210, 520 160 C590 100, 720 110, 790 180" fill="none" stroke="rgba(148,163,184,0.35)" strokeWidth="40" strokeLinecap="round" />
            <path d="M70 280 C160 250, 260 245, 360 280 C470 320, 600 305, 760 260" fill="none" stroke="rgba(148,163,184,0.28)" strokeWidth="34" strokeLinecap="round" />
            {points.map((point) => (
              <g key={`${point.country}-${point.x}-${point.y}`}>
                <circle cx={point.x} cy={point.y} r={point.radius + 4} fill="rgba(59,130,246,0.18)" />
                <circle cx={point.x} cy={point.y} r={point.radius} fill="rgba(59,130,246,0.7)">
                  <title>{`${point.country}: ${point.visitors} visitors`}</title>
                </circle>
              </g>
            ))}
          </g>
        </svg>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {(locations?.countries || []).slice(0, 8).map((item) => (
          <div key={item.country} className="theme-chip rounded-lg px-3 py-2 text-xs">
            <span className="mr-2">{countryFlag(item.country)}</span>
            <span>{item.country}</span>
            <span className="float-right font-semibold">{item.visitors}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
