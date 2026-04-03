import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Clock, Star } from 'lucide-react';
import { getUserFavourites, removeFavourite } from '../services/favouriteService';
import { getRestaurantById } from '../services/restaurantService';
import { getAverageRating } from '../services/ratingService';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Favourites = () => {
  const { user, isAuthenticated } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavourites = async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      const favRes = await getUserFavourites(user.id);
      const favs = favRes.data || [];

      const details = await Promise.all(
        favs.map(async (fav) => {
          try {
            const [restRes, avgRes] = await Promise.all([
              getRestaurantById(fav.restaurantId),
              getAverageRating(fav.restaurantId).catch(() => ({ data: null })),
            ]);
            return { ...restRes.data, avgData: avgRes.data };
          } catch {
            return null;
          }
        })
      );
      setRestaurants(details.filter(Boolean));
    } catch (err) {
      console.error('Failed to load favourites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, [user]);

  const handleRemove = async (e, restaurantId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await removeFavourite(user.id, restaurantId);
      setRestaurants(prev => prev.filter(r => r.id !== restaurantId));
    } catch (err) {
      console.error('Failed to remove favourite:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-8">My Favourites</h2>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {!loading && !isAuthenticated && (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 mb-4 text-lg">Please sign in to view your favourites.</p>
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </div>
        )}

        {!loading && isAuthenticated && restaurants.length === 0 && (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4 text-lg">No favourite restaurants yet.</p>
            <Link to="/restaurants" className="text-blue-600 font-medium hover:underline">Browse restaurants</Link>
          </div>
        )}

        {!loading && isAuthenticated && restaurants.length > 0 && (
          <div className="space-y-4">
            {restaurants.map(restaurant => (
              <Link
                key={restaurant.id}
                to={`/restaurants/${restaurant.id}`}
                className="flex bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition duration-300 group"
              >
                <div className="w-48 h-36 flex-shrink-0 overflow-hidden bg-gray-200 relative">
                  {restaurant.image ? (
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
                  )}
                </div>

                <div className="flex-1 p-5 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-sm font-semibold text-yellow-600">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {restaurant.avgData
                          ? `${Number(restaurant.avgData.averageRating).toFixed(1)} (${restaurant.avgData.totalRatings})`
                          : (restaurant.rating ?? 'N/A')}
                      </span>
                      <button
                        onClick={(e) => handleRemove(e, restaurant.id)}
                        className="p-1 rounded-full hover:bg-red-50 transition"
                        title="Remove from favourites"
                      >
                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 capitalize mb-3">{restaurant.category}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {restaurant.address}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {restaurant.deliveryTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Favourites;
