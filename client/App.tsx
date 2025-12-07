import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import Layout from "@/components/site/Layout";
import Products from "@/pages/Products";
import Placeholder from "@/components/site/Placeholder";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import AdminGuard from "@/components/site/AdminGuard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import Revenue from "./pages/Revenue";
import { CartProvider } from "@/context/CartContext";
import ProductDetail from "@/pages/ProductDetail";
import ProductManagement from "@/pages/ProductManagement";
import CartPage from "@/pages/Cart";
import Analytics from "@/pages/Analytics";
import CheckoutPage from "@/pages/Checkout";
import { AuthProvider } from "@/context/AuthContext";
import AdminReviews from "@/pages/AdminReviews";
import TermsOfService from "@/pages/TermsOfServices";
import TermsOfServices from "@/pages/TermsOfServices";
import AdminManagement from "@/pages/AdminManagement";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <CartProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/terms" element={<TermsOfServices />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
                <Route path="/admin/admins" element={<AdminGuard><AdminManagement /></AdminGuard>} />
                <Route path="/admin/users" element={<AdminGuard><Users /></AdminGuard>} />
                <Route path="/admin/products" element={<AdminGuard><ProductManagement /></AdminGuard>} />
                <Route path="/admin/reviews" element={<AdminGuard><AdminReviews /></AdminGuard>} />
                <Route path="/admin/analytics" element={<AdminGuard><Analytics /></AdminGuard>} />
                <Route path="/admin/revenue" element={<AdminGuard><Revenue /></AdminGuard>} />
                <Route path="/admin/orders" element={<AdminGuard><AdminOrders /></AdminGuard>} />
                <Route path="/help" element={<Help />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/about" element={<About />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
