# 🏥 Medizo - Medical Store Frontend

Modern React-based frontend for the Medizo Medical Store application with Vite, TypeScript, Tailwind CSS, and Radix UI.

## 📁 Folder Structure

```
medizo/
├── client/                 # React frontend
│   ├── pages/             # Route components
│   ├── components/        # Reusable components
│   │   ├── ui/           # Radix UI components
│   │   └── site/         # Custom site components
│   ├── context/          # React Context (Auth, Cart)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities & API helpers
│   ├── Images/           # Image assets
│   ├── App.tsx           # Main app with routing
│   └── global.css        # TailwindCSS config
├── backend/              # 🚀 Separate backend folder
│   ├── server/           # Express API
│   ├── shared/           # Shared types
│   └── ...
├── shared/               # Types shared with backend
├── vite.config.ts        # Vite configuration
├── tailwind.config.ts    # TailwindCSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Frontend dependencies
```

## 🚀 Quick Start

### Install Dependencies
```bash
pnpm install
```

### Development (Two Terminals)

**Terminal 1 - Start Backend API:**
```bash
cd backend
pnpm dev
# Runs on http://localhost:3000
```

**Terminal 2 - Start Frontend:**
```bash
pnpm dev
# Runs on http://localhost:5173
# Automatically proxies /api/* to backend
```

Visit http://localhost:5173

### Build for Production
```bash
# Build frontend only
pnpm build

# Build backend from backend folder
cd backend && pnpm build
```

## 🎯 Key Features

### Pages
- **Index** - Home page with featured products
- **Products** - Product listing with search & filters
- **ProductDetail** - Single product view with reviews
- **Cart** - Shopping cart management
- **Checkout** - Order placement
- **Login/Signup** - User authentication (Email + Google OAuth)
- **Profile** - User profile management
- **Orders** - View purchase history
- **AdminDashboard** - Admin analytics
- **AdminManagement** - Product & user management

### Components
- **Header** - Navigation with search
- **ProductCard** - Reusable product display
- **Cart** - Shopping cart interface
- **SearchSuggestions** - Real-time search
- **UI Library** - 40+ Radix UI components

### State Management
- **AuthContext** - User authentication state
- **CartContext** - Shopping cart state
- **React hooks** - Local component state

### Styling
- **TailwindCSS 3** - Utility-first CSS
- **Custom theme** - Colors, spacing, typography
- **Responsive design** - Mobile-first approach
- **Dark mode support** - Via next-themes

## 🔌 API Integration

Backend API runs separately on port 3000:

```bash
# Backend in backend/ folder
cd backend && pnpm dev

# Frontend auto-proxies to it
pnpm dev
```

All API calls are relative (`/api/*`) and automatically proxied during development.

### Environment Variables

**For local development (.env.local):**
```env
VITE_API_URL=http://localhost:3000
```

**For production:**
```env
VITE_API_URL=https://your-backend.onrender.com
```

## 📦 Dependencies

### Core
- **React 18** - UI library
- **React Router 6** - SPA routing
- **Vite 7** - Build tool & dev server
- **TypeScript** - Type safety

### UI & Styling
- **TailwindCSS 3** - Utility CSS
- **Radix UI** - Headless components (40+)
- **Lucide React** - Icons
- **Framer Motion** - Animations

### Features
- **@react-oauth/google** - Google login
- **@emailjs/browser** - Email service
- **axios** - HTTP client
- **react-hook-form** - Form handling
- **recharts** - Data visualization
- **react-slick** - Carousel

## 🏗️ Architecture

### React Router Setup
```typescript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/products" element={<Products />} />
    <Route path="/product/:id" element={<ProductDetail />} />
    {/* More routes... */}
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

### API Calls
```typescript
// Relative paths - proxied to backend
const data = await fetch('/api/products').then(r => r.json());
```

### Authentication Context
```typescript
const { user, login, logout } = useContext(AuthContext);
```

### Shopping Cart Context
```typescript
const { cart, addItem, removeItem, total } = useContext(CartContext);
```

## 🚀 Deployment

### Deploy Frontend to Vercel
```bash
# Vercel auto-detects Vite project
# Set environment variable:
VITE_API_URL=https://your-backend.onrender.com
```

### Deploy Backend to Render
See `backend/README.md`

## 📚 Project Scripts

```bash
pnpm dev                 # Start frontend dev server
pnpm dev:backend         # Start backend (from here)
pnpm build               # Build frontend
pnpm build:backend       # Build backend
pnpm test                # Run tests
pnpm typecheck           # TypeScript check
pnpm format.fix          # Format code
```

## 🎨 Customization

### Add New Colors
Edit `tailwind.config.ts` and `client/global.css`

### Add New Component
1. Create in `client/components/`
2. Use Radix UI as base if needed
3. Style with TailwindCSS

### Add New Page
1. Create in `client/pages/`
2. Add route in `client/App.tsx`

## 🔐 Security

- User passwords hashed server-side
- JWT tokens in localStorage
- Google OAuth via secure tokens
- CORS configured on backend
- Environment variables for secrets

## 🐛 Troubleshooting

### API calls fail
```bash
# Ensure backend is running
cd backend && pnpm dev

# Check VITE_API_URL in .env.local
VITE_API_URL=http://localhost:3000
```

### Port 5173 in use
```bash
# Change Vite port in vite.config.ts or:
VITE_PORT=3001 pnpm dev
```

### MongoDB errors
Backend has in-memory fallback if MongoDB unavailable

## 📖 Documentation

- **QUICKSTART.md** - Quick start guide
- **README_DEPLOYMENT.md** - Deployment guide
- **SEPARATE_BACKEND_FRONTEND.md** - Architecture docs
- **backend/README.md** - Backend documentation

## 🔗 Related

- **Backend**: `./backend/` - Express API server
- **Shared Types**: `./shared/` - Common interfaces

---

**Medizo Medical Store** | Full-stack React + Express application
