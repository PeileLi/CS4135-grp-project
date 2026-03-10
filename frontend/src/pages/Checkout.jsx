import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (cartItems.length === 0) {
    // 如果购物车空了，强制回餐厅页
    setTimeout(() => navigate('/restaurants'), 100);
    return null; 
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const address = formData.get('address');

    // 1. 模拟生成订单
    const newOrder = {
      id: Math.floor(100000 + Math.random() * 900000), // 随机6位订单号
      date: new Date().toISOString(),
      items: cartItems,
      total: cartTotal + 2.99,
      status: 'Preparing', // 初始状态
      address: address
    };

    // 2. 模拟网络请求保存订单 (存到 LocalStorage)
    setTimeout(() => {
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));
      
      // 3. 清空购物车 & 跳转
      clearCart();
      setLoading(false);
      navigate('/orders'); 
    }, 1500); 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-8">Checkout</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 左侧表单 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-4">Delivery Details</h3>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                <input required name="address" type="text" placeholder="123 Main St, New York" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input required name="phone" type="tel" placeholder="(555) 123-4567" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment</label>
                <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none bg-white">
                  <option>Credit Card (Visa/Master)</option>
                  <option>Cash on Delivery</option>
                </select>
              </div>
            </form>
          </div>

          {/* 右侧摘要 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.quantity}x {item.name}</span>
                  <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>€{cartTotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Delivery</span><span>€2.99</span></div>
              <div className="flex justify-between font-bold text-lg pt-2"><span>Total</span><span>€{(cartTotal + 2.99).toFixed(2)}</span></div>
            </div>
            
            <button 
              type="submit" 
              form="checkout-form"
              disabled={loading}
              className="w-full mt-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;