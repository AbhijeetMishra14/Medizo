# Medizo Deployment Guide

## 📋 Prerequisites

- Render account for backend deployment
- Netlify account for frontend deployment
- GitHub repository with three branches (master, backend, frontend)
- MongoDB Atlas account (or MongoDB local instance)

---

## 🚀 Backend Deployment (Render)

### Step 1: Deploy Backend to Render

1. Go to https://render.com
2. Create a new **Web Service**
3. Connect your GitHub repository
4. Select the **`backend`** branch
5. Service settings:
   - **Name:** `medizo-backend`
   - **Runtime:** Node
   - **Build Command:** `pnpm install && pnpm build`
   - **Start Command:** `pnpm start`

### Step 2: Set Environment Variables on Render

Add these environment variables in Render dashboard:

```
MONGODB_URI          → Your MongoDB connection string
                       (e.g., mongodb+srv://user:pass@cluster.mongodb.net/medizo)

NODE_ENV             → production

ADMIN_EMAIL          → admin@medizo.com

ADMIN_PASSWORD       → Your secure admin password

ADMIN_CODE           → Secret code for admin registration

GOOGLE_CLIENT_ID     → Your Google OAuth Client ID
                       (from Google Cloud Console)

GOOGLE_CLIENT_SECRET → Your Google OAuth Client Secret
                       (from Google Cloud Console)

FRONTEND_URL         → https://your-frontend.netlify.app
                       (Add after frontend deployment)
```

### Step 3: Get Your Backend URL

After deployment, you'll get a URL like:
```
https://medizo-backend-xxxx.onrender.com
```

**Save this URL!** You'll need it for frontend deployment.

---

## 🎨 Frontend Deployment (Netlify)

### Step 1: Deploy Frontend to Netlify

1. Go to https://netlify.com
2. Create a new site from Git
3. Connect your GitHub repository
4. Select the **`frontend`** branch
5. Build settings:
   - **Build Command:** `pnpm build`
   - **Publish Directory:** `dist`

### Step 2: Set Environment Variables on Netlify

Add these environment variables in Netlify **Site settings** → **Environment**:

```
VITE_API_URL           → https://medizo-backend-xxxx.onrender.com
                         (Your Render backend URL from Step 3 above)

VITE_GOOGLE_CLIENT_ID  → Your Google OAuth Client ID

VITE_FACEBOOK_APP_ID   → Your Facebook App ID (optional)
```

### Step 3: Configure Google OAuth

In Google Cloud Console:

1. Go to **APIs & Services** → **Credentials**
2. Edit your OAuth 2.0 Client
3. Add **Authorized JavaScript origins:**
   ```
   https://your-frontend.netlify.app
   ```
4. Add **Authorized redirect URIs:**
   ```
   https://medizo-backend-xxxx.onrender.com/api/auth/google/callback
   https://your-frontend.netlify.app/auth/google/callback
   ```

---

## ✅ Testing After Deployment

### 1. Test Backend API
```bash
curl https://medizo-backend-xxxx.onrender.com/api/products
```

### 2. Test Frontend
- Visit https://your-frontend.netlify.app
- Browse products
- Try login/signup
- Test Google OAuth

### 3. Test API Calls from Frontend
Open browser console and check:
- No CORS errors
- API responses successful
- Fonts and images loading correctly

---

## 🔧 Troubleshooting

### Issue: "502 Bad Gateway" on Netlify

**Cause:** Frontend can't reach backend API

**Solution:**
1. Check `VITE_API_URL` environment variable on Netlify
2. Verify Render backend is running
3. Check CORS settings in backend server code

### Issue: "CORS error" in browser console

**Cause:** Backend CORS not configured for frontend domain

**Solution:**
1. Update `FRONTEND_URL` environment variable on Render
2. Restart Render deployment
3. Clear browser cache and hard reload

### Issue: Fonts not loading (404 on slick.ttf, etc.)

**Cause:** Public folder not deployed correctly

**Solution:**
1. Verify `public/slick-fonts/` folder exists
2. Check `_redirects` file is in public folder
3. Rebuild and redeploy

### Issue: Google OAuth not working

**Cause:** Redirect URI mismatch

**Solution:**
1. Verify callback URL matches in Google Cloud Console
2. Check `GOOGLE_CLIENT_ID` is correct on Netlify
3. Ensure backend has correct `GOOGLE_CLIENT_SECRET`

---

## 🔄 Continuous Deployment

Both Netlify and Render auto-deploy when you push to their respective branches:

```bash
# Push changes to frontend
git checkout frontend
git push origin frontend
# ↓ Netlify auto-deploys

# Push changes to backend
git checkout backend
git push origin backend
# ↓ Render auto-deploys
```

---

## 📊 Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Backend environment variables set
- [ ] Frontend deployed to Netlify
- [ ] Frontend environment variables set
- [ ] Google OAuth configured
- [ ] CORS allows frontend domain
- [ ] API calls working from frontend
- [ ] Fonts and images loading
- [ ] Google login working
- [ ] Products displaying correctly
- [ ] Cart functionality working
- [ ] Checkout process working

---

## 🚨 Important Notes

1. **Keep secrets safe!** Never commit `.env` files to GitHub
2. **MONGODB_URI** should use MongoDB Atlas for production
3. **ADMIN_PASSWORD** should be strong and unique
4. **GOOGLE_CLIENT_SECRET** should only be on backend, never exposed to frontend
5. Test thoroughly before promoting to production

---

## 📞 Support

If you encounter issues:
1. Check Render/Netlify deployment logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Ensure GitHub branches are up to date
5. Try hard reload (Ctrl+Shift+R) to clear cache
