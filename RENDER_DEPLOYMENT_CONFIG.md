# 🚀 Medizo Deployment Configuration

## Important: Rendering/Deployment Branch Selection

### For Render Backend Deployment
**Deploy from the `backend` branch, NOT master**

- Branch: `backend`
- Build Command: `pnpm install --frozen-lockfile && pnpm build`
- Start Command: `pnpm start`
- Environment: Backend only (Express + MongoDB)

### For Netlify Frontend Deployment  
**Deploy from the `frontend` branch, NOT master**

- Branch: `frontend`
- Build Command: `pnpm build`
- Publish Directory: `dist`
- Environment: Frontend only (React)

### Master Branch
The `master` branch is a **full-stack reference** combining both backend and frontend.
It's for local development and reference only. **Do not deploy master to Render or Netlify**.

---

## Why Separate Branches?

- **backend**: Only Express API code → Deploy to Render
- **frontend**: Only React code → Deploy to Netlify
- **master**: Both combined → Local dev only

This keeps deployments small and focused.

---

## Troubleshooting Render Errors

If you see "frozen-lockfile" errors on Render:
1. Verify you're deploying the correct branch (`backend`, not `master`)
2. If deploying `master`, ensure Vite build works locally first
3. Check that the lockfile matches package.json

The `backend` branch contains minimal dependencies and builds much faster!
