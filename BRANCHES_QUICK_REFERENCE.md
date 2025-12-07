╔═════════════════════════════════════════════════════════════════════════════╗
║                                                                             ║
║              🚀 MULTI-BRANCH DEPLOYMENT - QUICK REFERENCE                  ║
║                                                                             ║
╚═════════════════════════════════════════════════════════════════════════════╝

THREE BRANCHES IN ONE REPO
═════════════════════════════════════════════════════════════════════════════

master              Deploy to Render (Backend API)     Deploy to Vercel (Frontend)
   ↓                       ↓                                   ↓
   │                       │                                   │
   └─→ deploy/backend ─────┴─ onrender.com/api ──────────────┘
   │
   └─→ deploy/frontend ──────── vercel.app
                                   ↓
                        netlify.app (alternative)


═════════════════════════════════════════════════════════════════════════════

🚀 DEPLOYMENT FLOW

Step 1: Work on master
┌──────────────────────────────────┐
│ git clone ...                    │
│ git checkout master              │
│ pnpm install                     │
│ cd backend && pnpm install       │
│ (make changes)                   │
│ git push origin master           │
└──────────────────────────────────┘

Step 2: Deploy Backend
┌──────────────────────────────────┐
│ git checkout deploy/backend      │
│ git rebase master                │
│ git push origin deploy/backend   │
│ → Render auto-deploys            │
│ → https://your-api.onrender.com  │
└──────────────────────────────────┘

Step 3: Deploy Frontend
┌──────────────────────────────────┐
│ git checkout deploy/frontend     │
│ git rebase master                │
│ VITE_API_URL set on Vercel       │
│ git push origin deploy/frontend  │
│ → Vercel/Netlify auto-deploys    │
│ → https://your-app.vercel.app    │
└──────────────────────────────────┘


═════════════════════════════════════════════════════════════════════════════

📋 BRANCH DETAILS

master (Development)
  ├─ Full stack (frontend + backend)
  ├─ For local development
  ├─ Both services run together
  └─ Push changes here first

deploy/backend
  ├─ Backend only (no React code)
  ├─ Minimal size for fast deploys
  ├─ Includes render.yaml
  ├─ Deploys to Render.com
  └─ Serves /api/* endpoints

deploy/frontend
  ├─ Frontend only (no Node code)
  ├─ Minimal size for fast deploys
  ├─ Includes vercel.json & netlify.toml
  ├─ Deploys to Vercel.com
  └─ Serves React app


═════════════════════════════════════════════════════════════════════════════

⚡ QUICK COMMANDS

# Develop locally
git checkout master
pnpm install && cd backend && pnpm install && cd ..
Terminal 1: cd backend && pnpm dev
Terminal 2: pnpm dev
Visit: http://localhost:5173

# Deploy backend
git checkout deploy/backend
git rebase master
git push origin deploy/backend
→ Auto-deploys to Render

# Deploy frontend
git checkout deploy/frontend
git rebase master
git push origin deploy/frontend
→ Auto-deploys to Vercel

# Update deploy branches from master
git checkout deploy/backend && git rebase master && git push -f
git checkout deploy/frontend && git rebase master && git push -f


═════════════════════════════════════════════════════════════════════════════

🔗 CONNECTING THEM

1. Deploy backend first:
   git push origin deploy/backend
   → Get URL: https://your-backend.onrender.com

2. Set frontend env var:
   VITE_API_URL=https://your-backend.onrender.com

3. Deploy frontend:
   git push origin deploy/frontend


═════════════════════════════════════════════════════════════════════════════

🌐 URLS AFTER DEPLOYMENT

Backend API
  Production: https://your-backend.onrender.com/api
  Development: http://localhost:3000/api

Frontend
  Production: https://your-app.vercel.app (or netlify.app)
  Development: http://localhost:5173


═════════════════════════════════════════════════════════════════════════════

📊 ENVIRONMENT VARIABLES

master (Development)
  VITE_API_URL=http://localhost:3000

deploy/backend (Render)
  MONGODB_URI=<your-mongodb-url>
  ADMIN_EMAIL=<your-email>
  ADMIN_PASSWORD=<your-password>
  ADMIN_CODE=<your-code>
  GOOGLE_CLIENT_ID=<your-id>

deploy/frontend (Vercel/Netlify)
  VITE_API_URL=https://your-backend.onrender.com


═════════════════════════════════════════════════════════════════════════════

✅ VERIFICATION

Test Backend
  curl https://your-backend.onrender.com/api/ping
  Response: {"message":"ping"}

Test Frontend
  Visit: https://your-app.vercel.app
  Check DevTools Network tab for /api/* calls

Test Integration
  Open DevTools
  Make API call (login, load products, etc.)
  Verify request goes to your backend
  Verify data returns from MongoDB


═════════════════════════════════════════════════════════════════════════════

🔄 UPDATING AFTER CHANGES

After changes on master:
  
  git checkout deploy/backend
  git rebase master
  git push origin deploy/backend --force-with-lease
  
  git checkout deploy/frontend
  git rebase master
  git push origin deploy/frontend --force-with-lease


═════════════════════════════════════════════════════════════════════════════

📚 FULL DOCUMENTATION

See these files for complete details:
  
  DEPLOYMENT_STRATEGY.md  ← Full deployment strategy
  backend/DEPLOY.md       ← Backend deployment details
  FRONTEND_DEPLOY.md      ← Frontend deployment details


═════════════════════════════════════════════════════════════════════════════

🎉 RESULT: Fully deployed full-stack app with:

  ✅ Backend API on Render
  ✅ Frontend React on Vercel
  ✅ Database on MongoDB Atlas
  ✅ Auto-deploy on git push
  ✅ Separate CI/CD pipelines
  ✅ Independent scaling
