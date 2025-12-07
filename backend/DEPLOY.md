# 🚀 Backend Deployment Branch

This branch (`deploy/backend`) is configured for deploying the **backend API only** to Render.

## What's In This Branch

✅ **Backend Only:**
- `backend/server/` - Express API code
- `backend/shared/` - Shared types
- `backend/scripts/` - Database seeds & tests
- `backend/public/` - Static files & uploads
- `backend/package.json` - Backend dependencies
- `backend/render.yaml` - Render deployment config

❌ **Frontend NOT included:**
- No React code
- No Vite config
- No TailwindCSS
- Keeps branch size small

## Deploy to Render

### Option 1: Using render.yaml (Recommended)
```bash
git push origin deploy/backend
# Render will automatically detect render.yaml and deploy
```

### Option 2: Manual Render Setup
1. Go to https://render.com
2. Create new Web Service
3. Connect this repository
4. Deploy branch: `deploy/backend`
5. Build Command: `cd backend && pnpm install && pnpm build`
6. Start Command: `node backend/dist/node-build.mjs`
7. Add environment variables:
   - `MONGODB_URI`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `ADMIN_CODE`
   - `GOOGLE_CLIENT_ID`

## Environment Variables

Set these on Render:
```
MONGODB_URI=mongodb+srv://user:pass@...
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-password
ADMIN_CODE=123456
GOOGLE_CLIENT_ID=your-google-id
NODE_ENV=production
PORT=3000
```

## Verify Deployment

After deployment, test the API:
```bash
curl https://your-render-service.onrender.com/api/ping
# Should return: {"message":"ping"}
```

## Keep in Sync with Main

```bash
# Pull latest from main
git checkout main
git pull origin main

# Rebase deploy/backend on main
git checkout deploy/backend
git rebase main

# If conflicts, resolve and continue
git add .
git rebase --continue

# Force push to update deploy/backend
git push origin deploy/backend --force-with-lease
```

## Frontend Integration

After backend is deployed, update frontend .env:
```env
VITE_API_URL=https://your-backend.onrender.com
```

Then deploy frontend to Vercel/Netlify using `deploy/frontend` branch.

---

**Branch Strategy:**
- `main` - Development (full stack)
- `deploy/backend` - Backend production (API only)
- `deploy/frontend` - Frontend production (React only)

