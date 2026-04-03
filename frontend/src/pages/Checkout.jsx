import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/orderService';
import { createPayment, processPayment } from '../services/paymentService';
import { validateDiscount } from '../services/discountService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CreditCard, Tag, MapPin, CheckCircle } from 'lucide-react';

const DELIVERY_FEE = 2.99;

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  const [cardNumber, setCardNumber] = useState('');

  if (cartItems.length === 0) {
    setTimeout(() => navigate('/restaurants'), 100);
    return null;
  }

  const restaurantId = cartItems[0]?.restaurantId;
  const restaurantName = cartItems[0]?.restaurantName || 'Restaurant';

  const subtotal = cartTotal;
  const discountAmount = appliedDiscount ? Number(appliedDiscount.discountAmount) : 0;
  const totalWithDelivery = Math.max(0, subtotal - discountAmount) + DELIVERY_FEE;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    setAppliedDiscount(null);

    try {
      const res = await validateDiscount(couponCode.trim(), subtotal);
      setAppliedDiscount(res.data);
      setCouponError('');
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
      setAppliedDiscount(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedDiscount(null);
    setCouponCode('');
    setCouponError('');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        userId: user.id,
        restaurantId,
        restaurantName,
        totalAmount: totalWithDelivery,
        deliveryAddress: address,
        items: cartItems.map(item => ({
          menuItemId: item.id,
          menuItemName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };
      const orderRes = await createOrder(orderData);
      const orderId = orderRes.data.id;

      const paymentRes = await createPayment({
        orderId,
        userId: user.id,
        amount: totalWithDelivery,
        paymentMethod: 'credit_card',
      });

      await processPayment(paymentRes.data.id, {
        paymentMethod: 'credit_card',
        cardNumber: cardNumber.replaceAll(' ', '') || '0000000000000000',
      });

      clearCart();
      navigate(`/orders/${orderId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: Delivery + Coupon + Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={20} className="text-gray-700" />
                  <h2 className="text-lg font-semibold">Delivery Details</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="checkout-address" className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                    <input
                      id="checkout-address"
                      required
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Main St, City"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      id="checkout-phone"
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={20} className="text-gray-700" />
                  <h2 className="text-lg font-semibold">Coupon Code</h2>
                </div>
                {appliedDiscount ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={18} className="text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Code &quot;{couponCode.toUpperCase()}&quot; applied — You save &euro;{Number(appliedDiscount.discountAmount).toFixed(2)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {couponLoading ? 'Checking...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="mt-2 text-sm text-red-600">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard size={20} className="text-gray-700" />
                  <h2 className="text-lg font-semibold">Payment</h2>
                </div>
                <div>
                  <label htmlFor="checkout-card" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    id="checkout-card"
                    required
                    type="text"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => {
                      const digits = e.target.value.replaceAll(/\D/g, '');
                      const formatted = digits.replaceAll(/(\d{4})(?=\d)/g, '$1 ').trim();
                      setCardNumber(formatted);
                    }}
                    placeholder="1234 5678 1234 5678"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none font-mono tracking-wider"
                  />
                  <p className="mt-1.5 text-xs text-gray-400">Enter any card number to simulate payment</p>
                </div>
              </div>
            </div>

            {/* Right column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
                <h3 className="text-xl font-semibold mb-1">Order Summary</h3>
                <p className="text-sm text-gray-500 mb-4">{restaurantName}</p>
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.quantity}x {item.name}</span>
                      <span className="font-medium">&euro;{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>&euro;{subtotal.toFixed(2)}</span>
                  </div>
                  {appliedDiscount && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-&euro;{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span>&euro;{DELIVERY_FEE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>&euro;{totalWithDelivery.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : `Pay \u20AC${totalWithDelivery.toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
