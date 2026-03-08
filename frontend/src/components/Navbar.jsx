import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { LogOut, ShoppingCart, Search } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center text-white text-2xl">
            🍔
          </div>
          <span className="font-semibold text-2xl text-gray-900">FoodExpress</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-12">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search restaurants or dishes..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-5 text-sm focus:outline-none focus:border-gray-900 transition"
            />
            <Search className="absolute left-5 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </form>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-gray-900 transition">Home</Link>
          <Link to="/restaurants" className="hover:text-gray-900 transition">Restaurants</Link>
          <Link to="/orders" className="hover:text-gray-900 transition">My Orders</Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">
          {/* Cart Icon with Badge */}
          <Link to="/cart" className="text-gray-600 hover:text-gray-900 transition relative">
            <ShoppingCart className="w-6 h-6" />
            
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 font-medium text-sm">
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <div className="hidden md:block text-sm">
                  <p className="font-medium text-gray-900">{user.fullName || 'User'}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}