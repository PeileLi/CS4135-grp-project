import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShoppingCart, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-gray-900 transition">Home</Link>
          <Link to="/restaurants" className="hover:text-gray-900 transition">Restaurants</Link>
          <Link to="/orders" className="hover:text-gray-900 transition">My Orders</Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">
          {/* Cart */}
          <Link to="/cart" className="text-gray-600 hover:text-gray-900 transition">
            <ShoppingCart className="w-5 h-5" />
          </Link>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              {/* User info */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 font-medium text-sm">
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <div className="hidden md:block text-sm">
                  <p className="font-medium text-gray-900">{user.fullName || 'User'}</p>
                </div>
              </div>

              {/* Logout */}
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