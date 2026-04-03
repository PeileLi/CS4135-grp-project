import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRestaurantsByOwner, addMenuItem, updateMenuItem, deleteMenuItem, getMenuByRestaurantId, updateRestaurant, toggleRestaurantOpen } from '../services/restaurantService';
import { getRestaurantOrders, updateOrderStatus, getRestaurantRevenue } from '../services/orderService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Store, Plus, Pencil, Trash2, Save, X, Package, ChevronDown, ChevronUp, ClipboardList, DollarSign, RefreshCw } from 'lucide-react';

export default function MerchantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState(null);
  const [editingRestaurant, setEditingRestaurant] = useState(null);

  const [activeTab, setActiveTab] = useState('menu');
  const [orders, setOrders] = useState({});
  const [revenue, setRevenue] = useState({});
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== 'RESTAURANT_OWNER') {
      navigate('/');
      return;
    }
    fetchRestaurants();
  }, [user, navigate]);

  const fetchRestaurants = async () => {
    try {
      const res = await getRestaurantsByOwner(user.id);
      const owned = Array.isArray(res.data) ? res.data : [];
      setRestaurants(owned);
      if (owned.length > 0) {
        setExpandedId(owned[0].id);
        await fetchMenu(owned[0].id);
      }
    } catch {
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenu = async (restaurantId) => {
    try {
      const res = await getMenuByRestaurantId(restaurantId);
      setMenuItems(prev => ({ ...prev, [restaurantId]: res.data }));
    } catch {
      setMenuItems(prev => ({ ...prev, [restaurantId]: [] }));
    }
  };

  const toggleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      if (!menuItems[id]) await fetchMenu(id);
    }
  };

  const handleAddItem = async (restaurantId) => {
    if (!newItem?.name || !newItem?.price) return;
    try {
      await addMenuItem(restaurantId, {
        name: newItem.name,
        description: newItem.description || '',
        price: Number.parseFloat(newItem.price),
      });
      setNewItem(null);
      await fetchMenu(restaurantId);
    } catch { /* ignore */ }
  };

  const handleUpdateItem = async (restaurantId, itemId) => {
    if (!editingItem) return;
    try {
      await updateMenuItem(restaurantId, itemId, {
        name: editingItem.name,
        description: editingItem.description,
        price: Number.parseFloat(editingItem.price),
        imageUrl: editingItem.imageUrl,
      });
      setEditingItem(null);
      await fetchMenu(restaurantId);
    } catch { /* ignore */ }
  };

  const handleDeleteItem = async (restaurantId, itemId) => {
    try {
      await deleteMenuItem(restaurantId, itemId);
      await fetchMenu(restaurantId);
    } catch { /* ignore */ }
  };

  const handleToggleOpen = async (id) => {
    try {
      await toggleRestaurantOpen(id);
      await fetchRestaurants();
    } catch { /* ignore */ }
  };

  const handleUpdateRestaurant = async (id) => {
    if (!editingRestaurant) return;
    try {
      await updateRestaurant(id, editingRestaurant);
      setEditingRestaurant(null);
      await fetchRestaurants();
    } catch { /* ignore */ }
  };

  const fetchOrdersForAll = async () => {
    setOrdersLoading(true);
    try {
      const results = {};
      const revResults = {};
      for (const r of restaurants) {
        const [ordersRes, revRes] = await Promise.all([
          getRestaurantOrders(r.id),
          getRestaurantRevenue(r.id),
        ]);
        results[r.id] = ordersRes.data;
        revResults[r.id] = revRes.data;
      }
      setOrders(results);
      setRevenue(revResults);
    } catch { /* ignore */ }
    setOrdersLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'orders' && restaurants.length > 0) {
      fetchOrdersForAll();
    }
  }, [activeTab, restaurants.length]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await fetchOrdersForAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  const ORDER_STATUS_FLOW = {
    PENDING: { next: 'CONFIRMED', label: 'Confirm Order', color: 'bg-blue-600 hover:bg-blue-700' },
    CONFIRMED: { next: 'PREPARING', label: 'Start Preparing', color: 'bg-orange-600 hover:bg-orange-700' },
    PREPARING: { next: 'READY', label: 'Mark Ready', color: 'bg-purple-600 hover:bg-purple-700' },
  };

  const STATUS_BADGE = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PREPARING: 'bg-orange-100 text-orange-800',
    READY: 'bg-purple-100 text-purple-800',
    DELIVERING: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Merchant Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your restaurants, menus and orders</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Store className="w-4 h-4" />
            {restaurants.length} restaurant{restaurants.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'menu' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <span className="flex items-center gap-2"><Package className="w-4 h-4" /> Menu Management</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'orders' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <span className="flex items-center gap-2"><ClipboardList className="w-4 h-4" /> Orders</span>
          </button>
        </div>

        {restaurants.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No Restaurants Yet</h2>
            <p className="text-sm text-gray-500">Your restaurant will appear here after it's been created.</p>
          </div>
        )}

        {restaurants.length > 0 && activeTab === 'orders' && (
          /* ====== ORDERS TAB ====== */
          <div className="space-y-6">
            {/* Revenue cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map(r => (
                <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5">
                  <p className="text-sm text-gray-500 mb-1">{r.name}</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-bold text-gray-900">
                      &euro;{Number(revenue[r.id]?.revenue || 0).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{revenue[r.id]?.orderCount || 0} orders today</p>
                </div>
              ))}
            </div>

            {ordersLoading ? (
              <div className="text-center py-10 text-gray-400">Loading orders...</div>
            ) : (
              restaurants.map(r => {
                const rOrders = orders[r.id] || [];
                return (
                  <div key={r.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{r.name} &mdash; Orders</h3>
                      <button onClick={fetchOrdersForAll} className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                    {rOrders.length === 0 ? (
                      <div className="px-6 py-8 text-center text-sm text-gray-400">No orders yet.</div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {rOrders.map(order => (
                          <div key={order.id} className="px-6 py-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="font-semibold text-gray-900">Order #{order.id}</span>
                                <span className="text-xs text-gray-500 ml-3">
                                  {new Date(order.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_BADGE[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              {order.items?.map((item, i) => (
                                <span key={item.id ?? item.menuItemName}>{i > 0 && ', '}{item.quantity}x {item.menuItemName}</span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-900">&euro;{Number(order.totalAmount).toFixed(2)}</span>
                              {ORDER_STATUS_FLOW[order.status] && (
                                <button
                                  onClick={() => handleStatusUpdate(order.id, ORDER_STATUS_FLOW[order.status].next)}
                                  className={`px-3 py-1.5 text-white text-xs font-medium rounded-lg transition ${ORDER_STATUS_FLOW[order.status].color}`}
                                >
                                  {ORDER_STATUS_FLOW[order.status].label}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {restaurants.length > 0 && activeTab !== 'orders' && (
          /* ====== MENU TAB ====== */
          <div className="space-y-6">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* Restaurant Header */}
                <button
                  type="button"
                  className="w-full px-6 py-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition text-left"
                  onClick={() => toggleExpand(restaurant.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Store className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">{restaurant.name}</h2>
                      <p className="text-xs text-gray-500">
                        {restaurant.category && <span className="capitalize">{restaurant.category}</span>}
                        {restaurant.address && <span> · {restaurant.address}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleOpen(restaurant.id); }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                        restaurant.open
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {restaurant.open ? 'Open' : 'Closed'}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingRestaurant({ ...restaurant }); }}
                      className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {expandedId === restaurant.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </button>

                {/* Edit Restaurant Modal */}
                {editingRestaurant && editingRestaurant.id === restaurant.id && (
                  <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Edit Restaurant</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input value={editingRestaurant.name || ''} onChange={e => setEditingRestaurant({ ...editingRestaurant, name: e.target.value })}
                        placeholder="Name" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                      <input value={editingRestaurant.address || ''} onChange={e => setEditingRestaurant({ ...editingRestaurant, address: e.target.value })}
                        placeholder="Address" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                      <input value={editingRestaurant.phone || ''} onChange={e => setEditingRestaurant({ ...editingRestaurant, phone: e.target.value })}
                        placeholder="Phone" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                      <input value={editingRestaurant.category || ''} onChange={e => setEditingRestaurant({ ...editingRestaurant, category: e.target.value })}
                        placeholder="Category" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleUpdateRestaurant(restaurant.id)}
                        className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition flex items-center gap-1">
                        <Save className="w-3.5 h-3.5" /> Save
                      </button>
                      <button onClick={() => setEditingRestaurant(null)}
                        className="px-4 py-2 bg-white border border-gray-200 text-sm rounded-lg hover:bg-gray-50 transition flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Menu Items */}
                {expandedId === restaurant.id && (
                  <div className="border-t border-gray-100">
                    <div className="px-6 py-4 flex items-center justify-between bg-gray-50">
                      <h3 className="text-sm font-semibold text-gray-700">Menu Items</h3>
                      <button
                        onClick={() => setNewItem({ name: '', description: '', price: '', restaurantId: restaurant.id })}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Item
                      </button>
                    </div>

                    {/* Add New Item Form */}
                    {newItem && newItem.restaurantId === restaurant.id && (
                      <div className="px-6 py-4 bg-green-50 border-b border-green-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                            placeholder="Item name" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                          <input value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                            placeholder="Description" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                          <input type="number" step="0.01" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                            placeholder="Price" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => handleAddItem(restaurant.id)}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition flex items-center gap-1">
                            <Plus className="w-3.5 h-3.5" /> Add
                          </button>
                          <button onClick={() => setNewItem(null)}
                            className="px-4 py-2 bg-white border border-gray-200 text-sm rounded-lg hover:bg-gray-50 transition">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Item List */}
                    <div className="divide-y divide-gray-100">
                      {(menuItems[restaurant.id] || []).length === 0 ? (
                        <div className="px-6 py-8 text-center text-sm text-gray-400">
                          No menu items yet. Add your first item above.
                        </div>
                      ) : (
                        (menuItems[restaurant.id] || []).map((item) => (
                          <div key={item.id} className="px-6 py-4">
                            {editingItem && editingItem.id === item.id ? (
                              <div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <input value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                  <input value={editingItem.description || ''} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                  <input type="number" step="0.01" value={editingItem.price} onChange={e => setEditingItem({ ...editingItem, price: e.target.value })}
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                </div>
                                <div className="flex gap-2 mt-3">
                                  <button onClick={() => handleUpdateItem(restaurant.id, item.id)}
                                    className="px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg hover:bg-gray-800 transition flex items-center gap-1">
                                    <Save className="w-3 h-3" /> Save
                                  </button>
                                  <button onClick={() => setEditingItem(null)}
                                    className="px-3 py-1.5 bg-white border border-gray-200 text-xs rounded-lg hover:bg-gray-50 transition">
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                  {item.description && <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>}
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-semibold text-gray-900">€{Number(item.price).toFixed(2)}</span>
                                  <button onClick={() => setEditingItem({ ...item })}
                                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => handleDeleteItem(restaurant.id, item.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
