# Google OAuth Configuration

## Issue
You may see this error in the browser console:
```
[GSI_LOGGER]: The given origin is not allowed for the given client ID.
```

## Fix
To resolve this, you need to add your localhost origin to Google Cloud Console:

### Steps:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" → "Credentials"
4. Find your OAuth 2.0 Client ID (169761714928-rkeq0qnmr7v5smbfisndiohdu56knlck.apps.googleusercontent.com)
5. Click on it to edit
6. Under "Authorized JavaScript origins", add:
   - `http://localhost:5173` (for development)
   - `http://localhost:8080` (for Vite dev server)
   - `http://127.0.0.1:5173`
7. Click "Save"

### For Production
Add your production domain:
- `https://yourdomain.com`

## Current Configuration
- Client ID: `169761714928-rkeq0qnmr7v5smbfisndiohdu56knlck.apps.googleusercontent.com`
- Development URL: `http://localhost:5173`

## Note
The Google OAuth functionality will work once these origins are configured. Until then, the Google Sign-In button may show warnings but the authentication flow should still work on configured domains.
