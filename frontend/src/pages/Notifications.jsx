import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getMyNotifications, markAsRead, markAllAsRead } from '../services/notificationService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Bell, CheckCheck, Package, CreditCard, Truck, Store, ShoppingBag } from 'lucide-react';

const TYPE_CONFIG = {
  ORDER_CREATED: { icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
  PAYMENT_SUCCESS: { icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
  DELIVERY_ASSIGNED: { icon: Truck, color: 'text-orange-600', bg: 'bg-orange-50' },
  DELIVERY_PICKED_UP: { icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
  DELIVERY_IN_TRANSIT: { icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  DELIVERY_DELIVERED: { icon: CheckCheck, color: 'text-green-600', bg: 'bg-green-50' },
  MERCHANT_NEW_ORDER: { icon: Store, color: 'text-amber-600', bg: 'bg-amber-50' },
  RIDER_ASSIGNED: { icon: Truck, color: 'text-cyan-600', bg: 'bg-cyan-50' },
};

const DEFAULT_CONFIG = { icon: Bell, color: 'text-gray-600', bg: 'bg-gray-50' };

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const res = await getMyNotifications(user.id);
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to load notifications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const handleClick = (notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.orderId) {
      navigate(`/orders/${notification.orderId}`);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell size={28} className="text-gray-900" />
            <h1 className="text-3xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2.5 py-1">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1.5"
            >
              <CheckCheck size={16} />
              Mark all as read
            </button>
          )}
        </div>

        {loading && (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="text-center py-20">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No notifications yet</p>
            <p className="text-gray-400 text-sm mt-1">
              You&apos;ll see order updates, payment confirmations, and delivery status here.
            </p>
          </div>
        )}

        {!loading && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map(notification => {
              const config = TYPE_CONFIG[notification.type] || DEFAULT_CONFIG;
              const Icon = config.icon;

              return (
                <button
                  key={notification.id}
                  onClick={() => handleClick(notification)}
                  className={`w-full text-left p-4 rounded-xl border transition hover:shadow-sm ${
                    notification.read
                      ? 'bg-white border-gray-100'
                      : 'bg-white border-l-4 border-l-blue-500 border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                      <Icon size={18} className={config.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                          {timeAgo(notification.createdAt)}
                        </span>
                      </div>
                      <p className={`text-sm mt-0.5 ${notification.read ? 'text-gray-400' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      {notification.orderId && (
                        <span className="inline-block mt-1.5 text-xs text-blue-600 font-medium">
                          Order #{notification.orderId} →
                        </span>
                      )}
                    </div>
                    {!notification.read && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Notifications;
