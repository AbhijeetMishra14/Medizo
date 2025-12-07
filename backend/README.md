# 🚀 Medizo Backend API

This is the standalone backend API server for the Medizo Medical Store application.

## 📁 Folder Structure

```
backend/
├── server/                 # Express server & routes
│   ├── config/            # Database & configuration
│   ├── middleware/        # Auth & custom middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   ├── index.ts           # Express app creation
│   ├── dev-server.ts      # Development server
│   └── node-build.ts      # Production server
├── shared/                # Shared types (with frontend)
├── scripts/               # Seed & test scripts
├── public/                # Static files (uploads, fonts)
├── package.json           # Backend dependencies
├── tsconfig.json          # TypeScript config
├── .env                   # Environment variables
└── vite.config.server.ts  # Build configuration
```

## 📦 Installation

Install dependencies:
```bash
pnpm install
```

## 🔧 Configuration

Create or update `.env`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
MONGODB_DB=medicalstore
PORT=3000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password123
ADMIN_CODE=123456
GOOGLE_CLIENT_ID=your-google-client-id
JWT_SECRET=your-jwt-secret
```

## 🏃 Running

### Development
```bash
pnpm dev
```
Runs on http://localhost:3000 with hot reload via tsx watch

### Production Build
```bash
pnpm build
```
Creates `dist/node-build.mjs`

### Production Start
```bash
pnpm start
```
Runs built server

### Seed Database
```bash
pnpm seed
```

## 🌐 API Endpoints

All endpoints are prefixed with `/api`

### Auth
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Admin
- `POST /api/admin/login` - Admin login
- `POST /api/admin/verify` - Verify 2FA code
- `GET /api/admin/me` - Get admin info

### Products
- `GET /api/products` - List products (public)
- `GET /api/products/:id` - Get product details
- `POST /api/admin/products` - Create product (admin)
- `PATCH /api/admin/products/:id` - Update product (admin)
- `DELETE /api/admin/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order (user)
- `GET /api/orders/user` - Get user orders
- `GET /api/orders/:id` - Get order details

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review (user)
- `PATCH /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Profile
- `GET /api/profile` - Get user profile
- `PATCH /api/profile` - Update profile

## 🗄️ Database

Uses MongoDB with Mongoose ODM:
- Collections: Users, Products, Orders, Reviews
- In-memory fallback when MongoDB unavailable

## 🔐 Authentication

- JWT-based user authentication
- Google OAuth 2.0 support
- 2FA code for admin login
- Password hashing with scrypt

## 📝 Development

### TypeScript Checking
```bash
pnpm typecheck
```

### Testing
```bash
pnpm test
```

### Scripts
```bash
node scripts/seed-user.mjs      # Seed test user
node scripts/test-mongo.mjs     # Test MongoDB connection
node scripts/test-admin.mjs     # Test admin routes
```

## 🚀 Deployment to Render

1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables
4. Render will automatically:
   - Run: `pnpm install && pnpm build`
   - Start: `pnpm start`

### Required Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `ADMIN_EMAIL` - Admin email
- `ADMIN_PASSWORD` - Admin password
- `ADMIN_CODE` - Admin 2FA code
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `NODE_ENV=production`

### Build Command (Optional)
```bash
pnpm build
```

### Start Command
```bash
pnpm start
```

## 📡 CORS

Configured to allow requests from any origin with credentials. Modify in `server/index.ts` if needed.

## 🐛 Troubleshooting

### MongoDB connection fails
- Check `MONGODB_URI` format
- Ensure IP whitelist includes Render's IPs
- App falls back to in-memory storage

### Port already in use
```bash
PORT=4000 pnpm dev
```

### JWT errors
- Ensure `JWT_SECRET` is set
- Default fallback secret used if not provided

## 📚 Documentation

- `/api/ping` - Health check
- `/api/demo` - Demo endpoint

---

Part of **Medizo Medical Store** | Backend Repository
