# 🚀 Quick Start - Separate Backend & Frontend

## What Changed?

Your project now has **separate development commands** so you can:
- Run backend independently (deploy to Render)
- Run frontend independently (deploy to Vercel/Netlify)
- Or run both together locally

## ⚡ Quick Start (Local Development)

### Terminal 1 - Backend
```bash
pnpm dev:backend
```
Runs on: **http://localhost:3000**

### Terminal 2 - Frontend  
```bash
pnpm dev:frontend
```
Runs on: **http://localhost:5173**

Frontend automatically proxies `/api/*` calls to backend.

---

## 🎯 For Render Deployment

### Backend Only
Push to Render with these settings:

| Setting | Value |
|---------|-------|
| **Build** | `pnpm build:server` |
| **Start** | `node dist/server/node-build.mjs` |
| **Env: MONGODB_URI** | `<your_mongodb_url>` |
| **Env: ADMIN_EMAIL** | `<your_email>` |
| **Env: ADMIN_PASSWORD** | `<your_password>` |
| **Env: ADMIN_CODE** | `<your_code>` |
| **Env: GOOGLE_CLIENT_ID** | `<your_id>` |

Then update your frontend to point to Render:
```
VITE_API_URL=https://your-render-service.onrender.com
```

---

## 📁 What's New?

| File | Purpose |
|------|---------|
| `server/dev-server.ts` | Standalone backend for development |
| `.env.local.example` | Template for frontend API URL |
| `SEPARATE_BACKEND_FRONTEND.md` | Detailed documentation |
| `package.json` | New scripts: `dev:backend`, `dev:frontend` |
| `vite.config.ts` | Updated with API proxy |

---

## 📚 See Also

- `SEPARATE_BACKEND_FRONTEND.md` - Full documentation
- `AGENTS.md` - Project structure & features
- `SETUP_GOOGLE_OAUTH.md` - OAuth setup

---

## ✅ Verification

Your backend works independently:
```bash
pnpm dev:backend
# Should output: 🚀 Backend API server running on http://localhost:3000
```

Your frontend works with API proxy:
```bash
pnpm dev:frontend
# Should output: VITE v... ready in ... ms
# Proxies /api/* to http://localhost:3000
```

---

## 🔑 Key Points

✅ Backend runs on port **3000**  
✅ Frontend runs on port **5173**  
✅ Frontend proxies API calls automatically  
✅ Can deploy backend to Render independently  
✅ Can deploy frontend to Vercel/Netlify separately  
✅ Production build still combines both  

---

Need help? See `SEPARATE_BACKEND_FRONTEND.md`
