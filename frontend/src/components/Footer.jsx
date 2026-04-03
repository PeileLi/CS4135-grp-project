import { Link } from 'react-router-dom';
import { CupSoda } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-gray-900">
                <CupSoda size={20} />
              </div>
              <span className="font-semibold text-xl text-white">FoodExpress</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Delicious food delivered fast to your door. Order from your favourite local restaurants.
            </p>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/restaurants" className="hover:text-white transition">Restaurants</Link></li>
              <li><Link to="/orders" className="hover:text-white transition">My Orders</Link></li>
              <li><Link to="/cart" className="hover:text-white transition">Cart</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} FoodExpress. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
