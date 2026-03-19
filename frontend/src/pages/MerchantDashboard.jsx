import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRestaurantsByOwner, addMenuItem, updateMenuItem, deleteMenuItem, getMenuByRestaurantId, updateRestaurant, toggleRestaurantOpen } from '../services/restaurantService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Store, Plus, Pencil, Trash2, Save, X, Package, ChevronDown, ChevronUp } from 'lucide-react';

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Merchant Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your restaurants and menus</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Store className="w-4 h-4" />
            {restaurants.length} restaurant{restaurants.length === 1 ? '' : 's'}
          </div>
        </div>

        {restaurants.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No Restaurants Yet</h2>
            <p className="text-sm text-gray-500">Your restaurant will appear here after it's been created.</p>
          </div>
        ) : (
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
