import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
// 引入两个全局状态管理
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* AuthProvider 在最外层，因为 Cart 可能需要知道是谁的购物车 */}
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);