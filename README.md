# My Portfolio

A modern, full-stack developer portfolio by **Habtamu Shewamene** that showcases projects, skills, and experience with an interactive AI assistant and production-style backend APIs.

## Developer
- **Name:** Habtamu Shewamene
- **GitHub:** https://github.com/HATAG-TECH
- **LinkedIn:** https://www.linkedin.com/in/habtamu-shewamene-25a5a63b5/
- **Email:** habtamushewamene905@gmail.com

## Project Description
This project is a responsive full-stack portfolio website built with React + Vite on the frontend and Node.js + Express on the backend. It highlights technical projects, professional experience, and skills, and includes a context-aware AI chat assistant plus a contact workflow with email notification support.

## Key Features
- Responsive layout (mobile, tablet, desktop)
- Dark/Light theme system
- AI chat assistant with conversation memory and project context
- Project showcase with filtering and detail modals
- Skills and experience timeline sections
- Contact form with backend validation and email delivery pipeline
- Rate-limited public APIs for security
- GitHub stats integration for repositories
- Framer Motion-powered transitions and interactions

## Tech Stack

### Frontend
- React (Vite)
- TailwindCSS
- Framer Motion
- React Router
- Axios / Fetch-based API service layer
- Context API (theme + chat state)

### Backend
- Node.js
- Express
- RESTful API architecture
- Nodemailer
- Express Rate Limit
- JSON file persistence (contacts, chats, visitors)

## Project Structure
```text
my-portfolio/
  public/
    profile-photo.jpg
  src/
    components/
      about/
      ai/
      contact/
      experience/
      footer/
      hero/
      navbar/
      projects/
      skills/
      ui/
    context/
    data/
    hooks/
    services/
    theme/
    App.jsx
    main.jsx
  server/
    config/
    controllers/
    data/
    middleware/
    models/
    routes/
    services/
    app.js
    server.js
  package.json
  vite.config.js
  tailwind.config.js
```

## Getting Started

### Prerequisites
- Node.js 18+ (recommended)
- npm 9+

### 1) Clone the repository
```bash
git clone https://github.com/HATAG-TECH/my-portfolio.git
cd my-portfolio
```

### 2) Install dependencies
```bash
npm install
```

### 3) Configure environment variables
Create a `.env` file in the project root (or `server/.env`):

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
TRUST_PROXY=false

# Email (required for real email delivery)
CONTACT_EMAIL_USER=your_email@example.com
CONTACT_EMAIL_PASS=your_email_app_password
CONTACT_EMAIL_TO=your_destination_email@example.com

# Optional rate limits
CONTACT_RATE_LIMIT_MAX=5
CONTACT_RATE_LIMIT_WINDOW_MS=3600000
CHAT_RATE_LIMIT_MAX=40
CHAT_RATE_LIMIT_WINDOW_MS=900000

# Optional stats defaults
GITHUB_USERNAME=HATAG-TECH
GITHUB_REPO=my-portfolio
LINKEDIN_FOLLOWERS=500

# Optional data directories
DATA_DIR=data
BACKUP_DIR=backups
```

Optional frontend env:

```env
VITE_API_BASE_URL=/api
```

### 4) Run the app
Run frontend + backend together:
```bash
npm run dev:full
```

Or run separately:

Frontend:
```bash
npm run dev
```

Backend:
```bash
npm run server
```

### 5) Open in browser
- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/api/health`

## Available Scripts
- `npm run dev` - Start Vite dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run server` - Start Express backend (`server/server.js`)
- `npm run dev:full` - Run frontend + backend concurrently

## API Overview
Base URL: `/api`

- `GET /health` - API health check
- `GET /projects` - List projects (supports filter/sort/pagination)
- `GET /projects/:id` - Get single project
- `POST /contact` - Submit contact form (rate-limited)
- `GET /contact/status` - Contact/email status diagnostics
- `POST /chat` - AI assistant response endpoint (rate-limited)
- `GET /stats` - Portfolio stats snapshot
- `GET /visitor` - Track visitor and return visitor snapshot
- `GET /test` - CORS validation endpoint

## Security and Validation
- Helmet-based secure HTTP headers
- Configurable CORS allowlist
- Per-route rate limiting for contact and chat APIs
- Input sanitization middleware
- Request payload validation for chat route
- Centralized error handling middleware

## Deployment Notes
- Build frontend with `npm run build`
- Serve `dist/` via static hosting (Netlify, Vercel, Nginx, etc.)
- Deploy backend separately (Render, Railway, VPS, etc.)
- Set `CLIENT_ORIGIN` in backend env to your deployed frontend URL
- If behind a reverse proxy, set `TRUST_PROXY=true`

## Recommended Deployment
This repo is set up best as:

- Frontend on Vercel
- Backend API on Render

### 1) Prepare secrets safely
- Do not commit `.env` or `server/.env`
- Use `.env.example` as the template for production variables
- If you have already stored real credentials in `server/.env`, rotate them before pushing the repo

### 2) Deploy the backend on Render
Create a new Render Web Service from this repo and point it to the `server` directory, or use the included `render.yaml` blueprint.

Backend settings:

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`

Backend environment variables:

```env
NODE_ENV=production
PORT=5000
CLIENT_ORIGIN=https://your-frontend-domain.vercel.app
TRUST_PROXY=true
CONTACT_EMAIL_USER=your_email@example.com
CONTACT_EMAIL_PASS=your_email_app_password
CONTACT_EMAIL_TO=your_destination_email@example.com
GITHUB_USERNAME=HATAG-TECH
GITHUB_REPO=my-portfolio
LINKEDIN_FOLLOWERS=500
DATA_DIR=data
BACKUP_DIR=backups
```

After deploy, confirm the backend works at:

- `https://your-backend-service.onrender.com/api/health`

### 3) Deploy the frontend on Vercel
Import the repo into Vercel and set the project root to `my-portfolio` if your repository contains other folders.

Frontend settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

Frontend environment variable:

```env
VITE_API_BASE_URL=https://your-backend-service.onrender.com/api
```

The included `vercel.json` adds a rewrite so client-side routes like `/analytics` work after refresh.

### 4) Update CORS
Set backend `CLIENT_ORIGIN` to the exact deployed frontend URL. If you later add a custom domain, update `CLIENT_ORIGIN` again.

### 5) Verify production flows
- Open the homepage and `/analytics`
- Submit the contact form
- Open the chat assistant
- Download the resume
- Check `GET /api/test` and `GET /api/health`

### Why this now works
- API requests already support `VITE_API_BASE_URL`
- Resume downloads now use the configured API base URL too
- Analytics live stream now uses the configured API base URL too

## Contact
For opportunities, collaboration, or feedback:
- GitHub: https://github.com/HATAG-TECH
- LinkedIn: https://www.linkedin.com/in/habtamu-shewamene-25a5a63b5/
- Email: habtamushewamene905@gmail.com

## License
This project is intended for portfolio and educational use. Add your preferred license in `LICENSE` if you plan public reuse terms.
