import { Link } from 'react-router-dom';
import { UtensilsCrossed, Store, Bike } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Hungry? Let's get you fed.
          </h1>
          <p className="text-xl text-gray-500 max-w-lg mx-auto mb-14">
            Order from the best local restaurants, grow your business, or deliver with us.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Link
              to="/restaurants"
              className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:border-gray-900 transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-5 group-hover:scale-110 transition-transform">
                <UtensilsCrossed size={24} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Browse Restaurants</h3>
              <p className="text-sm text-gray-500">Discover local restaurants and order your favourite food.</p>
            </Link>

            <Link
              to="/merchant"
              className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:border-gray-900 transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-5 group-hover:scale-110 transition-transform">
                <Store size={24} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Become a Merchant</h3>
              <p className="text-sm text-gray-500">List your restaurant and reach more customers.</p>
            </Link>

            <Link
              to="/rider"
              className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:border-gray-900 transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-5 group-hover:scale-110 transition-transform">
                <Bike size={24} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Become a Rider</h3>
              <p className="text-sm text-gray-500">Deliver food and earn on your own schedule.</p>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}