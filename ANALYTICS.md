# Analytics System

This portfolio includes a privacy-first analytics module with anonymous event tracking and a real-time dashboard.

## Backend Endpoints

- `POST /api/analytics/track`
  - Body: `{ "events": [ ... ] }`
  - Accepts a batch of analytics events.
- `POST /api/analytics/location`
  - Body: `{ lat, lng, city, country, countryCode, timestamp, sessionId, consent, dnt }`
  - Writes a privacy-safe location ping and applies rate limiting.
- `GET /api/analytics/visitors`
  - Returns active, today, and all-time unique visitors.
- `GET /api/analytics/locations?period=today|week|month|all`
- `GET /api/analytics/sections?period=today|week|month|all`
- `GET /api/analytics/projects?period=today|week|month|all`
- `GET /api/analytics/devices?period=today|week|month|all`
- `GET /api/analytics/dashboard?period=today|week|month|all`

## Frontend Components

- `src/components/analytics/AnalyticsDashboard.jsx`
- `src/components/analytics/VisitorCounter.jsx`
- `src/components/analytics/WorldMap.jsx`
- `src/components/analytics/SectionEngagement.jsx`
- `src/components/analytics/ProjectsRanking.jsx`
- `src/components/analytics/DeviceStats.jsx`
- `src/context/AnalyticsContext.jsx`
- `src/hooks/useAnalytics.js`

## Tracking Events

Supported `eventType` values:

- `page_view`
- `section_engagement`
- `project_view`
- `project_click`

Useful fields:

- `sessionId`
- `page`, `path`
- `sectionId`
- `projectId`, `projectAction` (`github`, `demo`, `details`)
- `dwellMs`, `scrollDepth`
- `deviceType`, `browser`, `os`, `screen`
- `country`, `city`, `locale`, `timezone`
- `consent`, `dnt`

## Privacy and Retention

- Anonymous collection only.
- Do Not Track (`navigator.doNotTrack`) is respected.
- User can consent or opt-out from dashboard controls.
- Events and sessions older than 30 days are removed automatically.
- No personal messages, email addresses, or names are stored by analytics events.
- Location endpoint hashes source IP server-side (`anonIpHash`) and never stores raw IP.

## Map Stack

- Frontend map uses `react-leaflet` with OpenStreetMap tiles.
- No external API key is required.
- Location points are aggregated into `locations.points` for map rendering.

## Storage

Analytics data is stored at:

- `server/data/analytics.json`

This file is initialized automatically by `server/models/jsonStore.js`.

## Real-Time Behavior

- Frontend refresh interval: 10 seconds.
- Event batching interval: 6 seconds.
- Active visitors = sessions seen in the last 5 minutes.

## Export

- Project ranking CSV export from `ProjectsRanking`.
- Full dashboard JSON export from `AnalyticsDashboard`.
