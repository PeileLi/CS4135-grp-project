import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Mail, Shield, Phone, MapPin, Save, ArrowLeft } from 'lucide-react';

export default function Profile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...user, ...form };
    login(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const roleLabel = (role) => {
    const map = {
      CUSTOMER: 'Customer',
      RESTAURANT_OWNER: 'Restaurant Owner',
      DELIVERY_DRIVER: 'Delivery Driver',
      ADMIN: 'Admin',
    };
    return map[role] || role;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-900 px-8 py-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {(user.name || user.email || 'U')[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{user.name || 'User'}</h1>
                <p className="text-gray-300 text-sm">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <Shield className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Role:</span>
              <span className="text-sm font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                {roleLabel(user.role)}
              </span>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  <Mail className="w-4 h-4 text-gray-400" />
                  Email
                </label>
                <input
                  type="text"
                  value={user.email || ''}
                  disabled
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  <User className="w-4 h-4 text-gray-400" />
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  <Phone className="w-4 h-4 text-gray-400" />
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                {saved && (
                  <p className="text-center text-sm text-green-600 mt-2">Changes saved successfully!</p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
