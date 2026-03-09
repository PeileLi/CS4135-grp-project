import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ArrowRight, ArrowLeft, TrendingUp, Users, BarChart3, Headphones } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Merchant() {
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Store className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h1>
            <p className="text-gray-500 mb-8">
              Thank you, {formData.ownerName}. We will review your application for <strong>{formData.restaurantName}</strong> and get back to you shortly.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition inline-flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const benefits = [
    { icon: TrendingUp, title: 'Grow Your Business', desc: 'Reach thousands of new customers in your area and increase your revenue.' },
    { icon: Users, title: 'Wider Audience', desc: 'Get discovered by hungry customers searching for restaurants like yours.' },
    { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track your orders, revenue, and customer feedback in real time.' },
    { icon: Headphones, title: 'Dedicated Support', desc: 'Our partner support team is available 7 days a week to help you succeed.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left - Introduction */}
            <div>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-900 mb-6 text-white">
                <Store className="w-7 h-7" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                Become a Merchant
              </h1>
              <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                Partner with FoodExpress and bring your restaurant online. List your menu, receive orders, and let our riders handle the delivery.
              </p>

              <div className="space-y-6">
                {benefits.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Form */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Apply Now</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-1.5">Restaurant Name</label>
                  <input
                    id="restaurantName"
                    name="restaurantName"
                    type="text"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-colors text-sm"
                    placeholder="e.g. Mario's Pizza"
                  />
                </div>

                <div>
                  <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1.5">Owner Name</label>
                  <input
                    id="ownerName"
                    name="ownerName"
                    type="text"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-colors text-sm"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="merchantEmail" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    id="merchantEmail"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-colors text-sm"
                    placeholder="restaurant@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-colors text-sm"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">Restaurant Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-colors text-sm"
                    placeholder="123 Main St, Limerick"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">Cuisine Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-colors text-sm"
                  >
                    <option value="">Select a category</option>
                    <option value="pizza">Pizza</option>
                    <option value="burger">Burger</option>
                    <option value="asian">Asian</option>
                    <option value="sushi">Sushi</option>
                    <option value="salad">Salad</option>
                    <option value="dessert">Dessert</option>
                    <option value="fast-food">Fast Food</option>
                    <option value="healthy">Healthy</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
