import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Bike, CheckCircle2, Package, Navigation } from 'lucide-react';

const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  ASSIGNED: 'bg-blue-100 text-blue-700',
  PICKED_UP: 'bg-purple-100 text-purple-700',
  IN_TRANSIT: 'bg-orange-100 text-orange-700',
  DELIVERED: 'bg-green-100 text-green-700',
};

const STATUS_LABELS = {
  PENDING: 'Pending',
  ASSIGNED: 'Assigned',
  PICKED_UP: 'Picked Up',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
};

export default function RiderDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (user?.role !== 'DELIVERY_DRIVER') {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rider Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your deliveries</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Status:</span>
            <button
              onClick={() => setAvailable(!available)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                available
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {available ? 'Available' : 'Offline'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Active Deliveries</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Completed Today</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Navigation className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">Total Distance</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">0 km</p>
          </div>
        </div>

        {/* Deliveries List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Current Deliveries</h2>
          </div>

          <div className="px-6 py-12 text-center">
            <Bike className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Deliveries</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              {available
                ? 'You are online and waiting for delivery requests. New orders will appear here.'
                : 'You are currently offline. Toggle your status to start receiving delivery requests.'}
            </p>
          </div>
        </div>

        {/* Delivery History */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Recent Delivery History</h2>
          </div>
          <div className="px-6 py-8 text-center text-sm text-gray-400">
            No delivery history yet. Completed deliveries will show up here.
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
