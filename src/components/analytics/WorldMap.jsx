import { useMemo } from 'react';
import { CircleMarker, MapContainer, TileLayer, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function countryFlag(countryCode) {
  const code = String(countryCode || 'UN').toUpperCase();
  if (code.length !== 2) return '🏳';
  const first = code.codePointAt(0) + 127397;
  const second = code.codePointAt(1) + 127397;
  return String.fromCodePoint(first, second);
}

function markerRadius(visitors) {
  return Math.max(4, Math.min(18, Math.sqrt(Number(visitors || 1)) * 2.2));
}

export default function WorldMap({ locations }) {
  const points = useMemo(() => {
    const rows = Array.isArray(locations?.points) ? locations.points : [];
    return rows
      .filter((row) => Number.isFinite(row?.lat) && Number.isFinite(row?.lng))
      .slice(0, 500);
  }, [locations]);

  const hasPoints = points.length > 0;

  return (
    <div className="theme-surface rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="theme-text-primary text-sm font-semibold">Geographic Visitor Map</h3>
        <p className="theme-text-soft text-xs">Leaflet + OpenStreetMap (no API key)</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--theme-border)]">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={2}
          maxZoom={8}
          worldCopyJump
          style={{ height: 340, width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {points.map((point, index) => (
            <CircleMarker
              key={`${point.country}-${point.city}-${point.lat}-${point.lng}-${index}`}
              center={[point.lat, point.lng]}
              radius={markerRadius(point.visitors)}
              pathOptions={{
                color: 'rgba(59,130,246,0.95)',
                fillColor: 'rgba(59,130,246,0.42)',
                fillOpacity: 0.75,
                weight: 1,
              }}
            >
              <Tooltip direction="top" offset={[0, -4]} opacity={0.95}>
                <div className="text-xs">
                  <p className="font-semibold">{point.country} {point.city !== 'unknown' ? `- ${point.city}` : ''}</p>
                  <p>Visitors: {point.visitors}</p>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {!hasPoints && (
        <p className="theme-text-soft mt-3 text-xs">
          No geolocation points yet. Once visitors opt-in and share approximate location, markers will appear.
        </p>
      )}

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {(locations?.countries || []).slice(0, 10).map((item) => (
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
