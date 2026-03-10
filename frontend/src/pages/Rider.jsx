import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bike, ArrowRight, ArrowLeft, Clock, MapPin, LogIn, ShieldX } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function Rider() {
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    vehicle: '',
    city: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

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

  const isOwnerRole = isAuthenticated && user?.role === 'RESTAURANT_OWNER';
  const canApply = isAuthenticated && !isOwnerRole;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bike className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h1>
            <p className="text-gray-500 mb-8">
              Thank you, {formData.fullName}. We will review your rider application and contact you at <strong>{user?.email}</strong> shortly.
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
    { icon: Clock, title: 'Flexible Hours', desc: 'Work whenever you want. Set your own schedule and deliver on your terms.' },
    { icon: MapPin, title: 'Deliver Locally', desc: 'Stay in your neighbourhood. Short delivery distances mean more orders per hour.' },
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
                <Bike className="w-7 h-7" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                Become a Rider
              </h1>
              <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                Join our delivery team and earn money on your own schedule. Whether you ride a bike, e-bike, or drive a car — there's a place for you.
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

            {/* Right - Form / Auth Gate */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">

              {!isAuthenticated && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <LogIn className="w-8 h-8 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Login Required</h2>
                  <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                    You need to log in before applying to become a rider.
                  </p>
                  <Link
                    to="/login"
                    state={{ from: { pathname: '/rider' } }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition"
                  >
                    Go to Login
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-gray-400 text-xs mt-4">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-gray-900 font-medium hover:underline">Register here</Link>
                  </p>
                </div>
              )}

              {isOwnerRole && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldX className="w-8 h-8 text-red-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Not Available</h2>
                  <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                    Your account is registered as a Restaurant Owner. Restaurant owners cannot apply to become a rider.
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                  </button>
                </div>
              )}

              {canApply && !showForm && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bike className="w-8 h-8 text-gray-700" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Ready to Get Started?</h2>
                  <p className="text-gray-500 mb-2 text-sm">
                    Logged in as <strong>{user?.email}</strong>
                  </p>
                  <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                    Click below to fill out the rider application form.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {canApply && showForm && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Application Form</h2>
                  <p className="text-gray-400 text-sm mb-6">Applying as {user?.email}</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="riderName" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                      <input
                        id="riderName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-colors text-sm"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="riderPhone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                      <input
                        id="riderPhone"
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
                      <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-1.5">Vehicle Type</label>
                      <select
                        id="vehicle"
                        name="vehicle"
                        value={formData.vehicle}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-colors text-sm"
                      >
                        <option value="">Select your vehicle</option>
                        <option value="bicycle">Bicycle</option>
                        <option value="ebike">E-Bike</option>
                        <option value="motorcycle">Motorcycle</option>
                        <option value="car">Car</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-colors text-sm"
                        placeholder="Limerick"
                      />
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
                </>
              )}
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
