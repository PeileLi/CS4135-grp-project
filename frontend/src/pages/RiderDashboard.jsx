import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getDriverByUserId,
  updateDriverStatus,
  getAvailableDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
  getDriverDeliveries,
  getDriverEarnings,
} from '../services/driverService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle2, Package, DollarSign, RefreshCw, MapPin } from 'lucide-react';

const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  ASSIGNED: 'bg-blue-100 text-blue-700',
  PICKED_UP: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const STATUS_LABELS = {
  PENDING: 'Pending',
  ASSIGNED: 'Assigned',
  PICKED_UP: 'Picked Up',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const NEXT_STATUS = {
  ASSIGNED: { status: 'PICKED_UP', label: 'Pick Up' },
  PICKED_UP: { status: 'DELIVERED', label: 'Mark Delivered' },
};

export default function RiderDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [driver, setDriver] = useState(null);
  const [available, setAvailable] = useState(true);
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'DELIVERY_DRIVER') {
      navigate('/');
      return;
    }
    fetchDriverData();
  }, [user, navigate]);

  const fetchDriverData = async () => {
    try {
      const driverRes = await getDriverByUserId(user.id);
      const driverData = driverRes.data;
      setDriver(driverData);
      setAvailable(driverData.available);

      const [availRes, myRes, earnRes] = await Promise.all([
        getAvailableDeliveries(),
        getDriverDeliveries(driverData.id),
        getDriverEarnings(driverData.id),
      ]);

      setAvailableDeliveries(availRes.data);
      setMyDeliveries(myRes.data);
      setEarnings(earnRes.data);
    } catch (err) {
      console.error('Failed to load driver data:', err);
      setError('Failed to load driver data. Please make sure you have registered as a rider.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!driver) return;
    try {
      const res = await updateDriverStatus(driver.id, !available);
      setAvailable(res.data.available);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status.');
    }
  };

  const handleAcceptDelivery = async (deliveryId) => {
    if (!driver) return;
    try {
      await acceptDelivery(driver.id, deliveryId);
      await fetchDriverData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept delivery.');
    }
  };

  const handleUpdateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      await updateDeliveryStatus(deliveryId, newStatus);
      await fetchDriverData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update delivery status.');
    }
  };

  const activeDeliveries = myDeliveries.filter(d => d.status === 'ASSIGNED' || d.status === 'PICKED_UP');
  const completedDeliveries = myDeliveries.filter(d => d.status === 'DELIVERED');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={() => navigate('/rider')} className="text-blue-600 hover:underline">
              Go to Rider Registration
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
            <button onClick={fetchDriverData} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
              <RefreshCw className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-500">Status:</span>
            <button
              onClick={handleToggleStatus}
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
            <p className="text-2xl font-bold text-gray-900">{activeDeliveries.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Completed</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{completedDeliveries.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">Total Earnings</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              &euro;{Number(earnings?.totalEarnings || 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-1">&euro;{Number(earnings?.deliveryFee || 5).toFixed(2)} per delivery</p>
          </div>
        </div>

        {/* Available Deliveries */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">Available Deliveries</h2>
            <span className="text-xs text-gray-400">{availableDeliveries.length} available</span>
          </div>

          {availableDeliveries.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No deliveries available right now.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {availableDeliveries.map(delivery => (
                <div key={delivery.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Order #{delivery.orderId}</p>
                    {delivery.deliveryAddress && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {delivery.deliveryAddress}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(delivery.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAcceptDelivery(delivery.id)}
                    disabled={!available}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Accept
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Deliveries */}
        {activeDeliveries.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700">My Active Deliveries</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {activeDeliveries.map(delivery => (
                <div key={delivery.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-gray-900">Order #{delivery.orderId}</span>
                      {delivery.deliveryAddress && (
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {delivery.deliveryAddress}
                        </p>
                      )}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[delivery.status] || ''}`}>
                      {STATUS_LABELS[delivery.status] || delivery.status}
                    </span>
                  </div>
                  {NEXT_STATUS[delivery.status] && (
                    <div className="mt-3">
                      <button
                        onClick={() => handleUpdateDeliveryStatus(delivery.id, NEXT_STATUS[delivery.status].status)}
                        className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
                      >
                        {NEXT_STATUS[delivery.status].label}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delivery History */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Delivery History</h2>
          </div>
          {completedDeliveries.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-gray-400">
              No completed deliveries yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {completedDeliveries.map(delivery => (
                <div key={delivery.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">Order #{delivery.orderId}</span>
                    {delivery.deliveryAddress && (
                      <p className="text-sm text-gray-500 mt-1">{delivery.deliveryAddress}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(delivery.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                    Delivered
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
