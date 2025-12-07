import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserPlusIcon, TrashIcon, ShieldCheckIcon, EyeIcon, EyeOffIcon } from "lucide-react";

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt: string;
  password?: string;
}

export default function AdminManagement() {
  const { token } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Fetch admins
  useEffect(() => {
    const fetchAdmins = async () => {
      if (!token) return;

      try {
        const res = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch admins");

        const data = await res.json();
        const adminUsers = data.users?.filter((u: any) => u.role === "admin") || [];
        setAdmins(adminUsers);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [token]);

  // Handle add admin
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: "admin",
        }),
      });

      if (!res.ok) throw new Error("Failed to create admin");

      const newAdmin = await res.json();
      setAdmins([...admins, { ...newAdmin.user, password: formData.password }]);
      setFormData({ name: "", email: "", password: "", phone: "" });
      setError(null);
      setSuccess("Admin created successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete admin
  const handleDeleteAdmin = async (id: string) => {
    if (!confirm("Are you sure you want to remove this admin?")) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete admin");

      setAdmins(admins.filter((a) => a._id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600">
        <p>Loading admins...</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin Management</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900 font-bold">×</button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex justify-between items-center">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-green-700 hover:text-green-900 font-bold">×</button>
        </div>
      )}

      {/* Add Admin Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <UserPlusIcon className="w-5 h-5" />
          Add New Admin
        </h2>

        <form onSubmit={handleAddAdmin} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Admin Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="email"
              placeholder="Admin Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="text"
              placeholder="Phone (optional)"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Admin"}
          </button>
        </form>
      </div>

      {/* Admins List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-6 text-gray-800 border-b border-gray-200 flex items-center gap-2">
          <ShieldCheckIcon className="w-5 h-5" />
          Current Admins ({admins.length})
        </h2>

        {admins.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">No admins found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Password
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {admins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {admin.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {admin.phone || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {showPasswords[admin._id] ? admin.password || "N/A" : "••••••••"}
                        </span>
                        <button
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              [admin._id]: !showPasswords[admin._id],
                            })
                          }
                          className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                          title={showPasswords[admin._id] ? "Hide" : "Show"}
                        >
                          {showPasswords[admin._id] ? (
                            <EyeOffIcon className="w-4 h-4" />
                          ) : (
                            <EyeIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDeleteAdmin(admin._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete admin"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
