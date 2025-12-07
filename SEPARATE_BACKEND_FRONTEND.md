# Running Backend and Frontend Separately

This guide explains how to run the backend (Render-deployable) and frontend independently.

## Setup

### 1. Create `.env.local` for local development

Copy the example file:
```bash
cp .env.local.example .env.local
```

This sets `VITE_API_URL=http://localhost:3000` for local development.

## Local Development (Two Terminals)

### Terminal 1: Start Backend API Server
```bash
pnpm dev:backend
```

This runs the backend on **http://localhost:3000**
- Serves all `/api/*` endpoints
- Uses MongoDB (with fallback to in-memory)
- Loads environment variables from `.env`

### Terminal 2: Start Frontend Dev Server
```bash
pnpm dev:frontend
```

This runs the frontend on **http://localhost:5173**
- Proxies all `/api/*` requests to http://localhost:3000
- Hot reload enabled
- Uses `VITE_API_URL` from `.env.local`

The frontend will automatically proxy API calls to your backend server.

## Production Build

Build both for production deployment:
```bash
pnpm build
```

This creates:
- `dist/spa/` - Frontend React app
- `dist/server/` - Backend Express server

### Run Production Server Locally
After building, test the production setup:
```bash
pnpm start
```

This starts the combined server on port 3000 (or `$PORT`):
- Serves both API and frontend from single port
- Frontend files served from `dist/spa/`
- API routes served from `/api/*`

## Deploying Backend to Render

### Option 1: Deploy Backend Only (Recommended)

1. Create new Web Service on Render
2. Connect your GitHub repo
3. Set Build Command:
   ```
   pnpm build:server
   ```
4. Set Start Command:
   ```
   node dist/server/node-build.mjs
   ```
5. Set Environment Variables:
   ```
   MONGODB_URI=<your_mongo_connection>
   ADMIN_EMAIL=<your_email>
   ADMIN_PASSWORD=<your_password>
   ADMIN_CODE=<your_code>
   GOOGLE_CLIENT_ID=<your_google_id>
   NODE_ENV=production
   PORT=3000
   ```

### Option 2: Deploy Full Stack (Backend + Frontend)

If you want a single Render service serving both:

1. Build Command:
   ```
   pnpm build
   ```
2. Start Command:
   ```
   pnpm start
   ```
3. Set same environment variables as above

## Environment Variables

### `.env` (Backend Configuration)
Required by the Express server:
- `MONGODB_URI` - MongoDB connection string
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_CODE` - Admin login
- `GOOGLE_CLIENT_ID` - Google OAuth
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - JWT signing secret (auto-generated if missing)

### `.env.local` (Frontend Configuration - Local Only)
- `VITE_API_URL` - Backend API URL for dev proxy

**Note:** `.env.local` is for **local development only** and not committed to git.

### Production Frontend
When deployed on Vercel/Netlify, set:
```
VITE_API_URL=https://your-render-backend.onrender.com
```

Or the frontend will default to relative paths (works if same domain).

## API Routing

### Local Development
- Backend: `http://localhost:3000/api/*`
- Frontend: `http://localhost:5173` → proxies `/api/*` to backend

### Production (Same Domain)
- Backend: `https://myapp.onrender.com/api/*`
- Frontend: `https://myapp.onrender.com` → relative `/api/*` calls work

### Production (Separate Domains)
- Backend: `https://my-backend.onrender.com`
- Frontend: `https://my-frontend.vercel.app`
- Frontend needs: `VITE_API_URL=https://my-backend.onrender.com`

## Troubleshooting

### Frontend can't reach backend
- Check `VITE_API_URL` in `.env.local`
- Ensure backend is running on port 3000
- Check CORS headers in `server/index.ts`

### Port 3000 already in use
Set custom port:
```bash
PORT=4000 pnpm dev:backend
```

Then update `.env.local`:
```
VITE_API_URL=http://localhost:4000
```

### MongoDB connection errors
- Check `MONGODB_URI` in `.env`
- App will use in-memory fallback if unavailable
- Check MongoDB Atlas connection string is correct

## Scripts Summary

```bash
pnpm dev              # Old: starts both (removed, use separate commands)
pnpm dev:backend      # NEW: Backend only (port 3000)
pnpm dev:frontend     # NEW: Frontend only (port 5173)
pnpm build            # Build both client and server
pnpm build:client     # Build frontend only
pnpm build:server     # Build backend only
pnpm start            # Run production server (full stack)
pnpm start:backend    # Run backend production only
```
