import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Clock, Star, Heart } from 'lucide-react';
import { getRestaurants } from '../services/restaurantService';
import { getUserFavourites, addFavourite, removeFavourite } from '../services/favouriteService';
import { getAverageRating } from '../services/ratingService';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'pizza', label: 'Pizza' },
  { value: 'burger', label: 'Burger' },
  { value: 'asian', label: 'Asian' },
  { value: 'sushi', label: 'Sushi' },
  { value: 'salad', label: 'Salad' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'fast-food', label: 'Fast Food' },
  { value: 'healthy', label: 'Healthy' },
];

const Restaurants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category')?.toLowerCase() || '');
  const [favouriteIds, setFavouriteIds] = useState(new Set());
  const [avgRatings, setAvgRatings] = useState({});

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await getRestaurants();
        const list = Array.isArray(response.data) ? response.data : [];
        setRestaurants(list);

        const ratingPromises = list.map(r =>
          getAverageRating(r.id)
            .then(res => ({ id: r.id, avg: res.data.averageRating, total: res.data.totalRatings }))
            .catch(() => ({ id: r.id, avg: null, total: 0 }))
        );
        const ratings = await Promise.all(ratingPromises);
        const map = {};
        ratings.forEach(r => { map[r.id] = r; });
        setAvgRatings(map);
      } catch (err) {
        console.error("Failed to load restaurants", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    getUserFavourites(user.id)
      .then(res => {
        const ids = new Set(res.data.map(f => f.restaurantId));
        setFavouriteIds(ids);
      })
      .catch(() => {});
  }, [user]);

  const toggleFavourite = async (e, restaurantId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user?.id) return;
    try {
      if (favouriteIds.has(restaurantId)) {
        await removeFavourite(user.id, restaurantId);
        setFavouriteIds(prev => { const s = new Set(prev); s.delete(restaurantId); return s; });
      } else {
        await addFavourite(user.id, restaurantId);
        setFavouriteIds(prev => new Set(prev).add(restaurantId));
      }
    } catch (err) {
      console.error('Failed to toggle favourite:', err);
    }
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (cat) params.category = cat;
    setSearchParams(params);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const params = {};
    if (value.trim()) params.search = value.trim();
    if (activeCategory) params.category = activeCategory;
    setSearchParams(params);
  };

  const filteredRestaurants = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return restaurants.filter(r => {
      const matchesSearch = !term || r.name?.toLowerCase().includes(term) || r.category?.toLowerCase().includes(term);
      const matchesCategory = !activeCategory || r.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [restaurants, searchTerm, activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search restaurants or cuisines..."
            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition shadow-sm"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => handleCategoryClick(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                activeCategory === cat.value
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            {activeCategory
              ? `${CATEGORIES.find(c => c.value === activeCategory)?.label} Restaurants`
              : 'All Restaurants'}
          </h2>
          {!loading && (
            <span className="text-sm text-gray-400">{filteredRestaurants.length} results</span>
          )}
        </div>

        {/* Restaurant List */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {!loading && filteredRestaurants.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No restaurants found.</p>
            <button
              onClick={() => { setSearchTerm(''); setActiveCategory(''); setSearchParams({}); }}
              className="mt-4 text-sm text-gray-900 font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {!loading && filteredRestaurants.length > 0 && (
          <div className="space-y-4">
            {filteredRestaurants.map(restaurant => (
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
                        {avgRatings[restaurant.id]?.avg != null
                          ? `${Number(avgRatings[restaurant.id].avg).toFixed(1)} (${avgRatings[restaurant.id].total})`
                          : (restaurant.rating ?? 'N/A')}
                      </span>
                      {user && (
                        <button
                          onClick={(e) => toggleFavourite(e, restaurant.id)}
                          className="p-1 rounded-full hover:bg-red-50 transition"
                          title={favouriteIds.has(restaurant.id) ? 'Remove from favourites' : 'Add to favourites'}
                        >
                          <Heart
                            className={`w-5 h-5 transition ${
                              favouriteIds.has(restaurant.id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-400 hover:text-red-400'
                            }`}
                          />
                        </button>
                      )}
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

export default Restaurants;