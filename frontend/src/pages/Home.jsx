import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          Hungry? Let's get you fed.
        </h1>
        <p className="text-xl text-gray-500 max-w-md mx-auto mb-10">
          Order from the best local restaurants and get it delivered fast directly to your door.
        </p>
        
        <Link 
          to="/restaurants" 
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition shadow-lg shadow-gray-200"
        >
          Browse Restaurants
        </Link>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[
            { name: 'Pizza', icon: '🍕' },
            { name: 'Burger', icon: '🍔' },
            { name: 'Asian', icon: '🍜' },
            { name: 'Sushi', icon: '🍣' },
            { name: 'Salad', icon: '🥗' },
            { name: 'Dessert', icon: '🍩' },
            { name: 'Fast Food', icon: '🍟' },
            { name: 'Healthy', icon: '🥑' },
          ].map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => navigate(`/restaurants?category=${cat.name.toLowerCase()}`)}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition cursor-pointer group text-center"
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="font-medium text-gray-900">{cat.name}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Near You */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex justify-between items-end mb-8">
           <h2 className="text-2xl font-bold text-gray-900">Popular near you</h2>
           <Link to="/restaurants" className="text-blue-600 font-medium hover:underline">See all</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
             { id: 1, name: "Burger King", time: "20-30 min", img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80" },
             { id: 2, name: "Pizza Hut", time: "30-45 min", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80" },
             { id: 3, name: "Sushi Master", time: "40-50 min", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80" }
          ].map((item) => (
            <Link
              key={item.id}
              to={`/restaurants/${item.id}`}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition group block"
            >
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.time} • Free delivery</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}