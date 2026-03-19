import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 页面组件
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Restaurants from './pages/Restaurants';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Merchant from './pages/Merchant';
import Rider from './pages/Rider';
import Profile from './pages/Profile';

// 保护组件
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* 公开路由 - 任何人都能看 */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/:id" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/merchant" element={<Merchant />} />
        <Route path="/rider" element={<Rider />} />
        
        {/* 受保护路由 - 只有登录后才能看 */}
        {/* 如果没登录，会自动跳到 login，登录完再跳回来 */}
        
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
      </Routes>
    </Router>
  );
}

export default App;