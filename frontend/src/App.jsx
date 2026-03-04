import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <Navbar />

                {/* Minimalist Hero */}
                <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
                  <h1 className="text-5xl font-semibold text-gray-900 mb-6">
                    Hungry? Let's get you fed.
                  </h1>
                  <p className="text-xl text-gray-500 max-w-md mx-auto">
                    Order from the best local restaurants and get it delivered fast.
                  </p>
                </div>

                {/* Simple Featured Section */}
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
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;