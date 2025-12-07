import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  UsersIcon,
  CubeIcon,
  StarIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const links = [
  { name: "Dashboard", path: "/admin", icon: <ChartBarIcon className="h-5 w-5" /> },
  { name: "Admin Management", path: "/admin/admins", icon: <ShieldCheckIcon className="h-5 w-5" /> },
  { name: "Users", path: "/admin/users", icon: <UsersIcon className="h-5 w-5" /> },
  { name: "Products", path: "/admin/products", icon: <CubeIcon className="h-5 w-5" /> },
  { name: "Reviews", path: "/admin/reviews", icon: <StarIcon className="h-5 w-5" /> },
  { name: "Orders", path: "/admin/orders", icon: <ShoppingCartIcon className="h-5 w-5" /> },
  { name: "Revenue", path: "/admin/revenue", icon: <CurrencyDollarIcon className="h-5 w-5" /> },
  { name: "Analytics", path: "/admin/analytics", icon: <ChartBarIcon className="h-5 w-5" /> },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const getGreeting = () => {
    if (user?.email === "abhijeetmishralyff@gmail.com") {
      return "Hi CTO/CFO Abhijeet Mishra";
    }
    return `Hi ${user?.name || "Admin"}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("adminData");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 p-4 flex flex-col justify-between min-h-screen">
      {/* Logo and Greeting */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-indigo-600 mb-3">Admin Panel</h2>
        <p className="text-sm font-medium text-gray-700">{getGreeting()}</p>
        <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const active = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 p-2 rounded-lg transition ${
                active
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-4 flex items-center justify-center gap-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
      >
        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
        Logout
      </button>
    </aside>
  );
}
