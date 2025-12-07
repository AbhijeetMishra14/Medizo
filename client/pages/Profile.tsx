import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, LogOut, Loader2, Edit, Plus, Phone, Mail, ChevronRight, ShoppingBag, ShieldCheck, XCircle } from 'lucide-react';
import { Clock, CheckCircle, Package, Truck, Box } from 'lucide-react';

// --- Configuration ---
const PRIMARY_COLOR = "indigo";
const PRIMARY_CLASS = `text-${PRIMARY_COLOR}-600`;
const BG_PRIMARY_CLASS = `bg-${PRIMARY_COLOR}-600`;
const HOVER_BG_CLASS = `hover:bg-${PRIMARY_COLOR}-700`;

// Mock Data for Demo
const mockUser = {
  name: "Aman Shrestha",
  email: "aman.shrestha@example.com",
  phone: "+977 9801234567",
  avatarUrl: '',
  dateJoined: "2023-01-15",
};

const mockAddresses = [
  {
    label: 'Home (Default)',
    name: 'Aman Shrestha',
    line1: 'Baluwatar Road',
    line2: 'House No. 12',
    city: 'Kathmandu',
    zip: '44600',
    country: 'Nepal',
    isDefault: true,
  },
  {
    label: 'Office',
    name: 'Aman Shrestha',
    line1: 'Himalayan Tower, 4th Floor',
    line2: 'New Baneshwor',
    city: 'Kathmandu',
    zip: '44600',
    country: 'Nepal',
    isDefault: false,
  },
];

// --- Address Card Component ---
const AddressCard = ({ addr }: { addr: typeof mockAddresses[0] }) => (
  <div className="border border-gray-200 rounded-xl p-5 text-sm bg-white shadow-sm hover:shadow-md transition relative">
    <div className="flex justify-between items-center mb-2">
      <span className={`font-bold text-base text-gray-800 flex items-center gap-2`}>
        <MapPin size={18} className={PRIMARY_CLASS} />
        {addr.label}
      </span>
      {addr.isDefault && (
        <span className={`text-xs font-semibold py-1 px-3 rounded-full bg-${PRIMARY_COLOR}-100 ${PRIMARY_CLASS}`}>
          Default
        </span>
      )}
    </div>
    <p className="font-medium text-gray-700 mt-2">{addr.name}</p>
    <p className="text-gray-600">{addr.line1}</p>
    <p className="text-gray-600">{addr.line2}</p>
    <p className="text-gray-600">{addr.city} - {addr.zip}, {addr.country}</p>

    <div className="mt-4 flex gap-3">
      <button className={`text-xs font-medium ${PRIMARY_CLASS} hover:underline flex items-center gap-1`}>
        <Edit size={14} /> Edit
      </button>
      <button className="text-xs font-medium text-red-500 hover:underline">
        Remove
      </button>
    </div>
  </div>
);

// --- Main Profile Component ---
export default function Profile() {
  const { user: contextUser, logout } = useAuth();
  const user = contextUser || mockUser;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [newEmail, setNewEmail] = useState(user.email);
  const [newPhone, setNewPhone] = useState(user.phone);
  const [newAvatar, setNewAvatar] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewAvatar(e.target.files[0]);
    }
  };

  const saveProfile = () => {
    console.log("Name:", newName, "Email:", newEmail, "Phone:", newPhone, "Avatar:", newAvatar);
    setShowEditModal(false);
  };

  useEffect(() => {
    if (!contextUser && !process.env.NODE_ENV === 'development') {
      navigate('/');
    } else {
      setLoading(false);
    }
  }, [contextUser, navigate]);

  const onLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Loader2 className={`w-8 h-8 ${PRIMARY_CLASS} animate-spin`} />
        <p className="mt-3 text-sm text-gray-600">Loading profile...</p>
      </div>
    );
  }

  // --- Tabs ---
  const tabs = [
    { id: 'general', label: 'General Info', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoField icon={Mail} label="Email Address" value={user.email} />
              <InfoField icon={Phone} label="Phone Number" value={user.phone} />
              <InfoField icon={User} label="Full Name" value={user.name} />
              <InfoField icon={MapPin} label="Location" value="Kathmandu, Nepal" />
            </div>
            <div className="pt-6 border-t border-gray-100">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h4>
              <button
                onClick={() => setShowEditModal(true)}
                className={`w-full md:w-auto inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium transition ${BG_PRIMARY_CLASS} text-white shadow-md`}
              >
                <Edit size={16} className="mr-2" /> Edit Profile Details
              </button>
            </div>
          </div>
        );
      case 'addresses':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Saved Addresses ({mockAddresses.length})</h3>
              <button className={`inline-flex items-center text-sm font-medium ${PRIMARY_CLASS} hover:underline`}>
                <Plus size={16} className="mr-1" /> Add New Address
              </button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {mockAddresses.map((addr, idx) => <AddressCard key={idx} addr={addr} />)}
            </div>
          </div>
        );
      case 'orders':
        return <OrdersTab />;
      case 'security':
        return (
          <div className="space-y-6">
            <p className="text-gray-700">Manage your password and security settings here.</p>
            <button className={`px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition`}>
              Change Password
            </button>
            <p className="text-sm text-gray-500">Last login: 2 hours ago from Kathmandu, Nepal</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-16 bg-gray-50 min-h-[80vh]">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">My Account</h1>
      <p className="text-gray-500 mb-10">Manage your profile, orders, and delivery addresses.</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 sticky top-4">
            <div className="flex items-center space-x-4 pb-4 border-b border-gray-100">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="h-16 w-16 rounded-full object-cover border-2 border-indigo-200" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-indigo-500 text-white flex items-center justify-center text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user.name || 'User Profile'}</h2>
                <p className="text-sm text-gray-500">{user.email || 'No Email'}</p>
              </div>
            </div>

            <nav className="mt-4 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center p-3 rounded-lg text-left font-medium transition ${activeTab === tab.id
                    ? `bg-${PRIMARY_COLOR}-50 ${PRIMARY_CLASS} border-r-4 border-${PRIMARY_COLOR}-600`
                    : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <tab.icon size={20} className="mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={onLogout}
                disabled={loggingOut}
                className={`w-full inline-flex justify-center items-center rounded-lg px-4 py-3 text-sm font-bold transition border border-red-300 ${loggingOut
                  ? 'bg-red-50 text-red-400 cursor-not-allowed'
                  : 'bg-red-50 hover:bg-red-100 text-red-600'}`}
              >
                {loggingOut ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogOut size={16} className="mr-2" />}
                {loggingOut ? 'Signing Out...' : 'Log out'}
              </button>
              <Link to="/about" className={`mt-4 text-xs font-medium ${PRIMARY_CLASS} hover:underline flex items-center justify-center gap-1`}>
                Learn about our Founder & CEO <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100">
            <h2 className={`text-2xl font-bold text-gray-900 mb-6 border-b pb-3`}>{tabs.find(t => t.id === activeTab)?.label}</h2>
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <XCircle size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

            <div className="flex flex-col items-center mb-4">
              {newAvatar ? (
                <img src={URL.createObjectURL(newAvatar)} alt="Preview" className="h-24 w-24 rounded-full object-cover border-2 border-indigo-200 mb-2" />
              ) : (
                <div className="h-24 w-24 rounded-full bg-indigo-500 text-white flex items-center justify-center text-3xl font-bold mb-2">
                  {newName.charAt(0).toUpperCase()}
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2 text-sm" />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="mt-1 block w-full border rounded-lg p-2 border-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="mt-1 block w-full border rounded-lg p-2 border-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="text" value={newPhone} onChange={e => setNewPhone(e.target.value)} className="mt-1 block w-full border rounded-lg p-2 border-gray-300" />
              </div>
            </div>

            <button onClick={saveProfile} className={`mt-6 w-full ${BG_PRIMARY_CLASS} text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium`}>
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Info Field Component ---
function InfoField({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
        <Icon size={16} className={`mr-2 ${PRIMARY_CLASS}`} /> {label}
      </div>
      <p className="text-lg font-semibold text-gray-800 break-words">{value}</p>
    </div>
  );
}

// --- OrdersTab Component ---
function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("auth_token");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const res = await fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const formatStatus = (status: string) => status.replaceAll("_", " ").toUpperCase();
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-5 h-5" />;
      case "confirmed": return <CheckCircle className="w-5 h-5" />;
      case "in_warehouse": return <Package className="w-5 h-5" />;
      case "shipped":
      case "out_for_delivery": return <Truck className="w-5 h-5" />;
      case "delivered": return <CheckCircle className="w-5 h-5" />;
      case "cancelled": return <Clock className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "delivered": return { container: "bg-green-50 border-green-300", iconText: "text-green-800 bg-green-200" };
      case "out_for_delivery": return { container: "bg-indigo-50 border-indigo-300", iconText: "text-indigo-800 bg-indigo-200" };
      case "shipped": return { container: "bg-blue-50 border-blue-300", iconText: "text-blue-800 bg-blue-200" };
      case "confirmed":
      case "in_warehouse": return { container: "bg-yellow-50 border-yellow-300", iconText: "text-yellow-800 bg-yellow-200" };
      case "cancelled": return { container: "bg-red-50 border-red-300", iconText: "text-red-800 bg-red-200" };
      default: return { container: "bg-gray-50 border-gray-300", iconText: "text-gray-800 bg-gray-200" };
    }
  };

  if (loading) return <div className="text-center py-20 text-indigo-500"><Clock className="w-8 h-8 mx-auto mb-3 animate-spin" /><p>Loading orders...</p></div>;
  if (orders.length === 0) return (
    <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-lg">
      <Box className="w-16 h-16 mx-auto text-indigo-400 mb-5" />
      <div className="text-xl font-semibold text-gray-700 mb-2">No Orders Found</div>
      <p className="text-gray-500 max-w-sm mx-auto">Looks like you haven't placed any orders yet.</p>
      <Link to="/products" className="mt-6 inline-block bg-indigo-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-indigo-700 transition shadow-md">Explore Products 💊</Link>
    </div>
  );

  return (
    <div className="space-y-4">
      {orders.slice(0, 3).map((o) => {
        const { container, iconText } = getStatusStyles(o.status);
        return (
          <Link
            to={`/orders/${o._id}`}
            key={o._id}
            className={`block border rounded-xl p-4 shadow-md transition duration-300 ${container} hover:shadow-lg`}
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="font-semibold text-indigo-900">Order #{o.orderNumber}</div>
                <div className="text-sm text-gray-600">Placed on: {new Date(o.createdAt).toLocaleDateString()}</div>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${iconText}`}>
                {getStatusIcon(o.status)} {formatStatus(o.status)}
              </div>
            </div>
            <div className="text-gray-700 font-medium">Total: ₹{o.total.toFixed(2)}</div>
          </Link>
        );
      })}
      <div className="mt-6 text-center">
        <Link
          to="/orders"
          className="inline-block bg-indigo-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-indigo-700 transition shadow-md"
        >
          View All Orders
        </Link>
      </div>
    </div>
  );
}
