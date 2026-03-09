import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRestaurantById, getMenuByRestaurantId } from '../services/restaurantService';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Plus } from 'lucide-react'; // 如果没有安装 lucide-react，可以用文字 "+" 代替

const Menu = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 获取购物车方法
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantRes, menuRes] = await Promise.all([
          getRestaurantById(id),
          getMenuByRestaurantId(id)
        ]);
        setRestaurant(restaurantRes.data);
        setMenuItems(menuRes.data);
      } catch (err) {
        console.error("Failed to fetch menu data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = (item) => {
    addToCart(item);
    // 这里可以用更高级的 Toast 组件，暂时用 alert 代替
    // alert(`${item.name} added to cart!`); 
  };

  if (loading) return <div className="p-10 text-center">Loading menu...</div>;
  if (!restaurant) return <div className="p-10 text-center">Restaurant not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* 餐厅头部信息 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
              <p className="text-gray-500 mb-4">{restaurant.category} • {restaurant.deliveryTime} • {restaurant.address}</p>
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                  ★ {restaurant.rating} Rating
                </span>
              </div>
            </div>
            {/* 以后可以放餐厅大图 */}
            {restaurant.image && (
              <img src={restaurant.image} alt={restaurant.name} className="w-full md:w-64 h-40 object-cover rounded-xl shadow-sm" />
            )}
          </div>
        </div>
      </div>
      
      {/* 菜单列表 */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h3 className="text-xl font-bold mb-6">Menu</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map(item => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition flex flex-col justify-between h-full">
              <div>
                <h4 className="font-bold text-lg mb-2">{item.name}</h4>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description}</p>
              </div>
              
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                <span className="font-bold text-lg">${item.price?.toFixed(2)}</span>
                <button 
                  onClick={() => handleAddToCart(item)}
                  className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800 transition active:scale-95 flex items-center gap-2 px-4 text-sm font-medium"
                >
                  Add <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Menu;