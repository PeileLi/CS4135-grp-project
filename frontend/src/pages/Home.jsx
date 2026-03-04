import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl font-semibold text-gray-900 mb-6">
          Hungry? Let's get you fed.
        </h1>
        <p className="text-xl text-gray-500 max-w-md mx-auto">
          Order from the best local restaurants and get it delivered fast.
        </p>
      </div>

      {/* Category Section */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Pizza'},
            { name: 'Burger'},
            { name: 'Asian'},
            { name: 'Sushi'},
            { name: 'Salad'},
            { name: 'Dessert'},
            { name: 'Fast Food'},
            { name: 'Healthy'},
          ].map((cat, i) => (
            <div
              key={i}
              onClick={() => navigate(`/restaurants?category=${cat.name.toLowerCase()}`)}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-sm transition cursor-pointer group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition">{cat.emoji}</div>
              <h3 className="font-medium text-gray-900">{cat.name}</h3>
              <p className="text-xs text-gray-500 mt-1">Explore restaurants</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Restaurants */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Popular near you</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-sm transition"
            >
              <div className="h-48 bg-gray-200" />
              <div className="p-6">
                <h3 className="font-medium text-lg text-gray-900">Restaurant {i}</h3>
                <p className="text-sm text-gray-500 mt-1">15–25 min • Free delivery</p>
                <button className="mt-6 w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">
                  Browse menu
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}