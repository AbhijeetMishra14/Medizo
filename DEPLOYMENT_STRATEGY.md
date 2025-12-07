# 🚀 Multi-Branch Deployment Strategy

Your repository now has **three deployment-ready branches** for different purposes.

## 📊 Branch Overview

```
Repository: AbhijeetMishra14/Medizo

├── master                    # 👨‍💻 Development branch
│   ├── Full stack (frontend + backend)
│   ├── Both services run locally
│   └── For development only
│
├── deploy/backend           # 🔧 Backend deployment
│   ├── Backend API only
│   ├── Deploys to Render
│   └── Serves http://localhost:3000/api
│
└── deploy/frontend          # 🎨 Frontend deployment
    ├── Frontend React only
    ├── Deploys to Vercel/Netlify
    └── Serves http://localhost:5173
```

## 🔄 Branch Workflow

### Development (master)
```bash
# Clone and work locally
git clone https://github.com/AbhijeetMishra14/Medizo.git
git checkout master

# Install all dependencies
pnpm install
cd backend && pnpm install && cd ..

# Run both services (2 terminals)
Terminal 1: cd backend && pnpm dev
Terminal 2: pnpm dev

# Make changes, test, commit
git add .
git commit -m "feature: add new feature"
git push origin master
```

### Deploy Backend
```bash
# Push to deploy/backend for Render
git checkout deploy/backend
git rebase master  # or merge

git push origin deploy/backend

# Render automatically detects and deploys
# Backend will be available at: https://your-service.onrender.com
```

### Deploy Frontend
```bash
# Push to deploy/frontend for Vercel/Netlify
git checkout deploy/frontend
git rebase master  # or merge

git push origin deploy/frontend

# Vercel/Netlify automatically detects and deploys
# Frontend will be available at: https://your-app.vercel.app
```

## 🚀 Deployment Checklist

### Before Deploying Backend

- [ ] All API tests pass locally
- [ ] Environment variables documented
- [ ] Database migrations complete
- [ ] No console errors on startup
- [ ] Health check endpoint `/api/ping` works

```bash
cd backend
pnpm dev
# Test: curl http://localhost:3000/api/ping
```

### Before Deploying Frontend

- [ ] All pages tested locally
- [ ] API calls verified working
- [ ] Build succeeds without errors
- [ ] No TypeScript errors
- [ ] Environment variables set

```bash
pnpm build
pnpm typecheck
# Test: open dist/index.html in browser
```

## 🔗 Connecting Frontend to Backend

After deploying backend to Render, get the URL:
```
https://medizo-backend.onrender.com
```

Then deploy frontend with environment variable:
```env
VITE_API_URL=https://medizo-backend.onrender.com
```

## 📋 Detailed Deployment Guides

### Backend to Render
See: **backend/DEPLOY.md**
- render.yaml configuration
- Environment variables needed
- Verification steps

### Frontend to Vercel
See: **FRONTEND_DEPLOY.md**
- vercel.json configuration
- Build and deploy steps
- API URL configuration

### Frontend to Netlify (Alternative)
See: **FRONTEND_DEPLOY.md**
- netlify.toml configuration
- Redirects for SPA routing
- API proxying setup

## 🔄 Keeping Branches in Sync

After changes to `master`, update deployment branches:

```bash
# Update deploy/backend
git checkout deploy/backend
git rebase master
git push origin deploy/backend --force-with-lease

# Update deploy/frontend
git checkout deploy/frontend
git rebase master
git push origin deploy/frontend --force-with-lease
```

## 🎯 Quick Deploy Commands

### Deploy Everything
```bash
# Backend to Render
git checkout deploy/backend
git rebase master
git push origin deploy/backend

# Frontend to Vercel
git checkout deploy/frontend
git rebase master
git push origin deploy/frontend
```

### Rollback if Issues
```bash
# Revert bad deploy
git push origin deploy/backend --force-with-lease  # to previous commit
# Render will auto-redeploy previous version
```

## 🌐 Architecture After Deployment

```
User Browser
    ↓
https://your-app.vercel.app (Frontend)
    ↓ API Calls
https://your-api.onrender.com/api/* (Backend)
    ↓
MongoDB Atlas
```

## 📊 Deployment Matrix

| Service | Branch | Platform | URL | Auto-Deploy |
|---------|--------|----------|-----|------------|
| Frontend | deploy/frontend | Vercel | your-app.vercel.app | ✅ Yes |
| Frontend | deploy/frontend | Netlify | your-app.netlify.app | ✅ Yes |
| Backend | deploy/backend | Render | your-api.onrender.com | ✅ Yes |
| Development | master | Local | localhost:5173 | ✗ Manual |

## 🔐 Environment Variables by Branch

### master (Development)
```env
VITE_API_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://...
```

### deploy/backend (Render)
```env
MONGODB_URI=mongodb+srv://...
ADMIN_EMAIL=your-email
ADMIN_PASSWORD=your-password
ADMIN_CODE=your-code
GOOGLE_CLIENT_ID=your-id
```

### deploy/frontend (Vercel/Netlify)
```env
VITE_API_URL=https://your-backend.onrender.com
```

## 📱 Branch Protection Rules (Optional)

Consider protecting branches:
```bash
# Require PRs before merge to master
# Auto-deploy from deploy/backend and deploy/frontend
# Restrict push to deploy/* branches
```

## 🛠️ Troubleshooting Deployments

### Backend deployment fails
- Check render.yaml syntax
- Verify build command works locally
- Confirm MongoDB connection string
- Review Render logs

### Frontend deployment fails
- Check vercel.json or netlify.toml
- Run `pnpm build` locally
- Verify VITE_API_URL is set
- Review build logs on Vercel/Netlify

### Frontend can't reach backend
- Verify VITE_API_URL environment variable
- Check backend is actually deployed
- Test API directly: `curl https://your-backend.onrender.com/api/ping`
- Check CORS configuration on backend

## ✅ Verification

After full deployment:

```bash
# Test backend
curl https://your-backend.onrender.com/api/ping
# Should return: {"message":"ping"}

# Test frontend
Visit https://your-app.vercel.app
# Should show Medizo Medical Store

# Test connectivity
Open DevTools → Network tab
Click button that makes API call
Should see request to your-backend.onrender.com/api/*
```

---

**Summary:**
- **master** = Full stack development
- **deploy/backend** = Push to Render for API deployment
- **deploy/frontend** = Push to Vercel for React deployment
- Each branch auto-deploys on push
- Keep branches in sync with master
