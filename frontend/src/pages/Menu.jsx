import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantById, getMenuByRestaurantId } from '../services/restaurantService';
import { getRatingsByRestaurant, getAverageRating } from '../services/ratingService';
import { checkFavourite, addFavourite, removeFavourite } from '../services/favouriteService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Plus, Heart, Star, User } from 'lucide-react';

const Menu = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [avgData, setAvgData] = useState(null);

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

        getRatingsByRestaurant(id)
          .then(res => setReviews(res.data || []))
          .catch(() => {});
        getAverageRating(id)
          .then(res => setAvgData(res.data))
          .catch(() => {});
      } catch (err) {
        console.error("Failed to fetch menu data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!user?.id || !id) return;
    checkFavourite(user.id, id)
      .then(res => setIsFav(res.data === true))
      .catch(() => {});
  }, [user, id]);

  const toggleFav = async () => {
    if (!user?.id) return;
    try {
      if (isFav) {
        await removeFavourite(user.id, id);
        setIsFav(false);
      } else {
        await addFavourite(user.id, id);
        setIsFav(true);
      }
    } catch (err) {
      console.error('Failed to toggle favourite:', err);
    }
  };

  const handleAddToCart = (item) => {
    addToCart({
      ...item,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    });
  };

  if (loading) return <div className="p-10 text-center">Loading menu...</div>;
  if (!restaurant) return <div className="p-10 text-center">Restaurant not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Restaurant header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
                {user && (
                  <button
                    onClick={toggleFav}
                    className="p-2 rounded-full hover:bg-red-50 transition"
                    title={isFav ? 'Remove from favourites' : 'Add to favourites'}
                  >
                    <Heart className={`w-6 h-6 transition ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`} />
                  </button>
                )}
              </div>
              <p className="text-gray-500 mb-4">{restaurant.category} • {restaurant.deliveryTime} • {restaurant.address}</p>
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                  ★ {avgData ? `${Number(avgData.averageRating).toFixed(1)} (${avgData.totalRatings} reviews)` : (restaurant.rating ?? 'N/A')}
                </span>
              </div>
            </div>
            
            {restaurant.image && (
              <img src={restaurant.image} alt={restaurant.name} className="w-full md:w-64 h-40 object-cover rounded-xl shadow-sm" />
            )}
          </div>
        </div>
      </div>
      
      {/* Menu items */}
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
                <span className="font-bold text-lg">€{item.price?.toFixed(2)}</span>
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

      {/* Reviews section */}
      <div className="max-w-6xl mx-auto px-6 pb-10">
        <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">User #{review.userId}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Menu;