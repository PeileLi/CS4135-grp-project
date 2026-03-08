import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getRestaurants } from '../services/restaurantService';
import Navbar from '../components/Navbar';

const Restaurants = () => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search')?.toLowerCase() || '';
  const category = searchParams.get('category')?.toLowerCase() || '';
  
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await getRestaurants();
        // 确保数据存在，如果 response.data 是数组就用，否则给空数组
        setRestaurants(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to load restaurants", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // 过滤逻辑：同时满足 "搜索词" 和 "分类"
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name?.toLowerCase().includes(searchTerm) || 
                          restaurant.category?.toLowerCase().includes(searchTerm);
    const matchesCategory = category ? restaurant.category === category : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {category 
            ? `${category.charAt(0).toUpperCase() + category.slice(1)} Restaurants` 
            : 'All Restaurants'}
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No restaurants found.</p>
            <button 
              onClick={() => window.location.href='/restaurants'} 
              className="mt-4 text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map(restaurant => (
              <Link
                key={restaurant.id}
                to={`/restaurants/${restaurant.id}`}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition duration-300 block group"
              >
                {/* 图片区域 */}
                <div className="h-48 overflow-hidden bg-gray-200 relative">
                   {restaurant.image ? (
                     <img 
                       src={restaurant.image} 
                       alt={restaurant.name} 
                       className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                   )}
                   {/* 配送时间标签 */}
                   <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                     {restaurant.deliveryTime}
                   </div>
                </div>
                
                {/* 内容区域 */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                       {restaurant.name}
                     </h3>
                     <span className="flex items-center bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                       ★ {restaurant.rating}
                     </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 capitalize">{restaurant.category} • {restaurant.address}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;