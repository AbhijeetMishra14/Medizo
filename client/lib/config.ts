/**
 * API Configuration
 * Automatically uses Render backend URL in production, localhost in development
 */

// Get backend URL from environment or use default
const getBackendUrl = (): string => {
  // In production (Netlify), use Render backend URL
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || "https://medizo-backend.onrender.com";
  }
  // In development, use localhost
  return "http://localhost:3000";
};

export const API_BASE_URL = getBackendUrl();

export const API_ENDPOINTS = {
  // Auth
  signup: "/api/auth/signup",
  login: "/api/auth/login",
  googleAuth: "/api/auth/google",
  getCurrentUser: "/api/auth/me",

  // Products
  products: "/api/products",
  productDetail: (id: string) => `/api/products/${id}`,

  // Orders
  createOrder: "/api/orders",
  getOrders: "/api/orders",
  getOrderDetail: (id: string) => `/api/orders/${id}`,

  // Reviews
  getReviews: (productId: string) => `/api/reviews/product/${productId}`,
  createReview: "/api/reviews",
  updateReview: (id: string) => `/api/reviews/${id}`,
  deleteReview: (id: string) => `/api/reviews/${id}`,

  // Profile
  getProfile: "/api/profile",
  updateProfile: "/api/profile",

  // Admin
  adminProducts: "/api/admin/products",
  adminProductDetail: (id: string) => `/api/admin/products/${id}`,
};

/**
 * Build full API URL for fetch requests
 */
export const buildApiUrl = (endpoint: string): string => {
  // If endpoint already starts with http, use it as is
  if (endpoint.startsWith("http")) {
    return endpoint;
  }
  // Otherwise combine with base URL
  return `${API_BASE_URL}${endpoint}`;
};

console.log(`[API Config] Using backend: ${API_BASE_URL}`);
