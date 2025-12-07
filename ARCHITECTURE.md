# 📁 Project Architecture - Backend & Frontend Separated

Your project is now properly organized with backend and frontend as independent services.

## 🏗️ Project Structure

```
medizo/                              # Root: Frontend project
├── backend/                         # 🚀 BACKEND (Express API Server)
│   ├── server/
│   │   ├── index.ts               # Express app factory
│   │   ├── node-build.ts          # Production server
│   │   ├── dev-server.ts          # Development server
│   │   ├── config/
│   │   │   └── db.ts              # MongoDB connection
│   │   ├── middleware/
│   │   │   └── auth.ts            # JWT & auth middleware
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Product.ts
│   │   │   ├── Order.ts
│   │   │   └── Review.ts
│   │   ├── routes/
│   │   │   ├── auth.ts            # User authentication
│   │   │   ├── admin-auth.ts      # Admin login
│   │   │   ├── products.ts        # Product management
│   │   │   ├── orders.ts          # Order management
│   │   │   ├── reviews.ts         # Reviews
│   │   │   ├── profile.ts         # User profile
│   │   │   └── seed.ts            # Database seeding
│   │   └── services/
│   │       ├── productService.ts
│   │       └── userService.ts
│   ├── shared/
│   │   └── api.ts                # Shared TypeScript types
│   ├── scripts/
│   │   ├── seed-user.mjs
│   │   ├── test-admin.mjs
│   │   └── ...
│   ├── public/
│   │   └── uploads/              # File uploads storage
│   ├── .env                       # Backend environment
│   ├── package.json               # Backend dependencies
│   ├── tsconfig.json              # Backend TypeScript
│   ├── tsconfig.node.json
│   ├── vite.config.server.ts     # Backend build config
│   └── README.md                  # Backend docs
│
├── client/                         # 👥 FRONTEND (React + Vite)
│   ├── pages/                     # Page components (auto-routed)
│   │   ├── Index.tsx              # Home
│   │   ├── Products.tsx           # Product list
│   │   ├── ProductDetail.tsx      # Product detail
│   │   ├── Cart.tsx               # Shopping cart
│   │   ├── Checkout.tsx           # Order checkout
│   │   ├── Login.tsx              # User login
│   │   ├── Signup.tsx             # User signup
│   │   ├── Profile.tsx            # User profile
│   │   ├── Orders.tsx             # Order history
│   │   ├── AdminDashboard.tsx    # Admin dashboard
│   │   ├── AdminManagement.tsx   # Manage products/users
│   │   ├── Contact.tsx            # Contact page
│   │   ├── Help.tsx               # Help page
│   │   └── NotFound.tsx           # 404 page
│   ├── components/
│   │   ├── ui/                   # 40+ Radix UI components
│   │   │   ├── button/
│   │   │   ├── card/
│   │   │   ├── dialog/
│   │   │   ├── dropdown-menu/
│   │   │   └── ... (many more)
│   │   └── site/                 # Custom site components
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── Navigation.tsx
│   │       └── ProductCard.tsx
│   ├── context/
│   │   ├── AuthContext.tsx        # User auth state
│   │   └── CartContext.tsx        # Shopping cart state
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── api.ts                 # API fetch wrapper
│   │   ├── utils.ts               # Helper functions
│   │   └── currency.ts            # Currency formatting
│   ├── Images/
│   ├── global.css                 # TailwindCSS theme
│   ├── App.tsx                    # Main app + routing
│   └── src/
│       └── main.tsx               # React entry point
│
├── shared/                         # 🔗 SHARED (between backend & frontend)
│   └── api.ts                    # Common types & interfaces
│
├── netlify/                        # Netlify serverless functions
│   └── functions/
│       └── api.ts
│
├── vite.config.ts                # Frontend Vite config
├── tailwind.config.ts            # TailwindCSS theme
├── postcss.config.js             # PostCSS config
├── tsconfig.json                 # Frontend TypeScript
├── package.json                  # Frontend dependencies only
│
├── .env                          # Backend config (used by backend/.env)
├── .env.local                    # Frontend dev API URL (local only, not committed)
├── .env.local.example            # Template
│
├── README.md                     # Frontend & project overview
├── QUICKSTART.md                 # Quick start guide
├── README_DEPLOYMENT.md          # Deployment instructions
├── ARCHITECTURE.md               # This file
├── PUSH_TO_GITHUB.md             # Git instructions
└── .gitignore
```

## 🚀 Running Locally

### Step 1: Install Dependencies
```bash
# Frontend deps
pnpm install

# Backend deps
cd backend && pnpm install && cd ..
```

### Step 2: Create .env.local (frontend dev config)
```bash
cp .env.local.example .env.local
# Content: VITE_API_URL=http://localhost:3000
```

### Step 3: Start Backend (Terminal 1)
```bash
cd backend
pnpm dev
# Runs on http://localhost:3000
# Loading from backend/server/dev-server.ts
```

### Step 4: Start Frontend (Terminal 2)
```bash
pnpm dev
# Runs on http://localhost:5173
# Proxies /api/* to http://localhost:3000
```

Visit **http://localhost:5173** in your browser.

## 🔄 Communication Flow

### Local Development
```
React App (http://localhost:5173)
    ↓
fetch('/api/products')
    ↓
Vite Proxy (vite.config.ts)
    ↓
Express Server (http://localhost:3000)
    ↓
MongoDB
```

### Production (Separate Deployments)
```
Frontend (Vercel)
    env: VITE_API_URL=https://api.render.com
    ↓
fetch('/api/products')
    ↓
Backend (Render)
    ↓
MongoDB
```

## 📦 Dependencies

### Frontend (`package.json`)
- **React 18** - UI library
- **React Router 6** - Client-side routing
- **Vite 7** - Build tool
- **TailwindCSS 3** - Styling
- **Radix UI** - Component library
- **TypeScript** - Type safety

### Backend (`backend/package.json`)
- **Express 5** - Web server
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Google Auth Library** - OAuth
- **CORS** - Cross-origin requests

### Shared (`shared/api.ts`)
- Common TypeScript interfaces
- Type safety across frontend & backend

## 🔐 Environment Configuration

### Backend (.env in root, copied to backend/.env)
```env
MONGODB_URI=mongodb+srv://...
MONGODB_DB=medicalstore
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password
ADMIN_CODE=123456
GOOGLE_CLIENT_ID=...
JWT_SECRET=secret (auto-generated if not set)
PORT=3000
```

### Frontend Dev (.env.local - local only)
```env
VITE_API_URL=http://localhost:3000
```

### Frontend Production (Vercel environment variables)
```env
VITE_API_URL=https://my-backend.onrender.com
```

## 📝 Scripts

### Root (Frontend)
```bash
pnpm dev              # Start React dev server
pnpm dev:backend      # Start backend (cd backend && pnpm dev)
pnpm build            # Build frontend only
pnpm build:backend    # Build backend (cd backend && pnpm build)
pnpm typecheck        # Type check
pnpm test             # Run tests
pnpm format.fix       # Format code
```

### Backend
```bash
cd backend
pnpm dev              # Development server with hot reload
pnpm build            # Production build
pnpm start            # Run production server
pnpm seed             # Seed database
pnpm typecheck        # Type check
pnpm test             # Tests
```

## 🌐 API Endpoints

All API calls are prefixed with `/api`:

### Authentication
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Current user

### Products
- `GET /api/products` - List all
- `GET /api/products/:id` - Get one
- `POST /api/admin/products` - Create (admin)
- `PATCH /api/admin/products/:id` - Update (admin)
- `DELETE /api/admin/products/:id` - Delete (admin)

### Orders
- `POST /api/orders` - Create
- `GET /api/orders` - List user's orders
- `GET /api/orders/:id` - Get order

### Reviews
- `GET /api/reviews/product/:id` - Get product reviews
- `POST /api/reviews` - Create review
- `PATCH /api/reviews/:id` - Update
- `DELETE /api/reviews/:id` - Delete

### User Profile
- `GET /api/profile` - Get profile
- `PATCH /api/profile` - Update profile

## 🚀 Deployment

### Deploy Backend to Render

1. Push to GitHub
2. Create Web Service on Render
3. Build Command:
   ```
   cd backend && pnpm build
   ```
4. Start Command:
   ```
   node backend/dist/node-build.mjs
   ```
5. Set Environment Variables (same as .env)
6. Deploy!

### Deploy Frontend to Vercel

1. Push to GitHub
2. Create Project on Vercel
3. Build Command:
   ```
   pnpm build
   ```
4. Output Directory:
   ```
   dist
   ```
5. Environment Variables:
   ```
   VITE_API_URL=https://your-render-backend.onrender.com
   ```
6. Deploy!

## 🏛️ Key Improvements

✅ **Separation of Concerns**
- Backend and frontend completely independent
- Can be developed/deployed separately
- Clear responsibility boundaries

✅ **Scalability**
- Backend can handle API requests from multiple frontends
- Easy to add mobile apps later
- Microservice-ready architecture

✅ **Type Safety**
- Shared types in `shared/api.ts`
- TypeScript throughout
- API contracts enforced at build time

✅ **Development Velocity**
- Hot reload in both services
- Clear folder structure
- Easy onboarding for team members

✅ **Production Ready**
- Proven deployment on Render & Vercel
- Environment-based configuration
- Error handling & logging

---

**Next Steps:**
1. Read **QUICKSTART.md** (5 min)
2. Run locally: Backend + Frontend side-by-side
3. Deploy Backend to Render
4. Deploy Frontend to Vercel
5. Connect them with `VITE_API_URL`
