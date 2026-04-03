import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { getMyOrders, cancelOrder } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle, XCircle, Truck, ChefHat, Package } from 'lucide-react';

const STATUS_CONFIG = {
  PENDING:    { label: 'Pending',    color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  CONFIRMED:  { label: 'Confirmed',  color: 'bg-blue-100 text-blue-800',     icon: CheckCircle },
  PREPARING:  { label: 'Preparing',  color: 'bg-orange-100 text-orange-800', icon: ChefHat },
  READY:      { label: 'Ready',      color: 'bg-purple-100 text-purple-800', icon: Package },
  DELIVERING: { label: 'Delivering', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
  DELIVERED:  { label: 'Delivered',  color: 'bg-green-100 text-green-800',   icon: CheckCircle },
  CANCELLED:  { label: 'Cancelled',  color: 'bg-red-100 text-red-800',       icon: XCircle },
};

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleCancel = async (orderId) => {
    if (!globalThis.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await cancelOrder(orderId);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-8">My Orders</h2>

        {loading && (
          <div className="text-center py-10 text-gray-500">Loading orders...</div>
        )}

        {!loading && error && (
          <div className="text-center py-10 text-red-500">{error}</div>
        )}

        {!loading && !error && !isAuthenticated && (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 mb-4 text-lg">Please sign in to view your orders.</p>
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </div>
        )}

        {!loading && !error && isAuthenticated && orders.length === 0 && (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 mb-4 text-lg">No orders found.</p>
            <Link to="/restaurants" className="text-blue-600 font-medium hover:underline">Start ordering now</Link>
          </div>
        )}

        {!loading && !error && isAuthenticated && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map(order => {
              const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
              const StatusIcon = config.icon;
              return (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 border-b border-gray-100 pb-4 gap-2">
                    <div>
                      <h3 className="font-bold text-lg">Order #{order.id}</h3>
                      <p className="text-sm text-gray-500">
                        {order.restaurantName && <span className="text-gray-700 font-medium">{order.restaurantName} &middot; </span>}
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className={`${config.color} px-3 py-1 rounded-full text-sm font-bold w-fit flex items-center gap-1.5`}>
                      <StatusIcon size={14} />
                      {config.label}
                    </span>
                  </div>

                  <div className="space-y-1 mb-4">
                    {order.items?.map((item) => (
                      <div key={item.id ?? item.menuItemName} className="flex justify-between text-sm text-gray-700">
                        <span>{item.quantity}x {item.menuItemName}</span>
                        <span>&euro;{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="font-bold text-gray-900 text-lg">&euro;{Number(order.totalAmount).toFixed(2)}</span>
                    {order.status === 'PENDING' && (
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCancel(order.id); }}
                        className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
