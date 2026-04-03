import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Page components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Restaurants from './pages/Restaurants';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Merchant from './pages/Merchant';
import Rider from './pages/Rider';
import Profile from './pages/Profile';
import MerchantDashboard from './pages/MerchantDashboard';
import RiderDashboard from './pages/RiderDashboard';
import Notifications from './pages/Notifications';
import Favourites from './pages/Favourites';

// Protected route wrapper
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/:id" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/merchant" element={<Merchant />} />
        <Route path="/rider" element={<Rider />} />
        
        {/* Protected routes - requires authentication */}
        
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/orders" element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />
        <Route path="/orders/:id" element={
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/merchant/dashboard" element={
          <ProtectedRoute>
            <MerchantDashboard />
          </ProtectedRoute>
        } />
        <Route path="/rider/dashboard" element={
          <ProtectedRoute>
            <RiderDashboard />
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />
        <Route path="/favourites" element={
          <ProtectedRoute>
            <Favourites />
          </ProtectedRoute>
        } />
        
      </Routes>
    </Router>
  );
}

export default App;