import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/orderService';
import { getPaymentByOrder } from '../services/paymentService';
import { createRating, getRatingByOrder, updateRating, deleteRating } from '../services/ratingService';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Clock, CheckCircle, XCircle, Truck, ChefHat, Package, ArrowLeft, RefreshCw, Star } from 'lucide-react';

const STATUS_STEPS = [
  { key: 'PENDING', label: 'Pending', icon: Clock },
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle },
  { key: 'PREPARING', label: 'Preparing', icon: ChefHat },
  { key: 'READY', label: 'Ready', icon: Package },
  { key: 'DELIVERING', label: 'Delivering', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
];

const PAYMENT_STATUS = {
  PENDING: { label: 'Pending', color: 'text-yellow-700 bg-yellow-50' },
  SUCCESS: { label: 'Paid', color: 'text-green-700 bg-green-50' },
  FAILED: { label: 'Failed', color: 'text-red-700 bg-red-50' },
  REFUNDED: { label: 'Refunded', color: 'text-gray-700 bg-gray-50' },
};

const OrderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [existingRating, setExistingRating] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingMsg, setRatingMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = async () => {
    try {
      const orderRes = await getOrderById(id);
      setOrder(orderRes.data);

      try {
        const paymentRes = await getPaymentByOrder(id);
        setPayment(paymentRes.data);
      } catch (err) {
        console.debug('Payment not available for order:', err.message);
        setPayment(null);
      }
    } catch (err) {
      console.error('Failed to load order details:', err);
      setError('Failed to load order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!user?.id || !id) return;
    getRatingByOrder(Number(id), user.id)
      .then(res => {
        if (res.data) {
          setExistingRating(res.data);
          setRatingValue(res.data.rating);
          setComment(res.data.comment || '');
        }
      })
      .catch(() => {});
  }, [user, id]);

  const handleSubmitRating = async () => {
    if (ratingValue < 1 || ratingValue > 5) {
      setRatingMsg('Please select a rating (1-5 stars).');
      return;
    }
    setRatingSubmitting(true);
    setRatingMsg('');
    try {
      if (existingRating && isEditing) {
        const res = await updateRating(existingRating.id, { rating: ratingValue, comment });
        setExistingRating(res.data);
        setIsEditing(false);
        setRatingMsg('Rating updated!');
      } else {
        const res = await createRating({
          orderId: Number(id),
          userId: user.id,
          restaurantId: order.restaurantId,
          rating: ratingValue,
          comment,
        });
        setExistingRating(res.data);
        setRatingMsg('Thank you for your review!');
      }
    } catch (err) {
      setRatingMsg(err.response?.data?.message || 'Failed to submit rating.');
    } finally {
      setRatingSubmitting(false);
    }
  };

  const handleDeleteRating = async () => {
    if (!existingRating) return;
    try {
      await deleteRating(existingRating.id);
      setExistingRating(null);
      setRatingValue(0);
      setComment('');
      setRatingMsg('Rating deleted.');
    } catch {
      setRatingMsg('Failed to delete rating.');
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-500">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-red-500">{error || 'Order not found.'}</div>
        <Footer />
      </div>
    );
  }

  const isCancelled = order.status === 'CANCELLED';
  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === order.status);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/orders" className="text-gray-500 hover:text-gray-900 transition">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h2 className="text-3xl font-bold">Order #{order.id}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {order.restaurantName && <span className="font-medium text-gray-700">{order.restaurantName} &middot; </span>}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <button onClick={handleRefresh} className="text-gray-500 hover:text-gray-900 transition p-2 rounded-lg hover:bg-gray-100">
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Status tracker */}
        {isCancelled ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 flex items-center gap-3">
            <XCircle className="text-red-500" size={24} />
            <div>
              <p className="font-semibold text-red-800">Order Cancelled</p>
              <p className="text-sm text-red-600">This order has been cancelled.</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">Order Status</h3>
            <div className="flex items-center justify-between">
              {STATUS_STEPS.map((step, index) => {
                const isActive = index <= currentStepIndex;
                const StepIcon = step.icon;
                return (
                  <React.Fragment key={step.key}>
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        <StepIcon size={18} />
                      </div>
                      <span className={`text-xs font-medium ${isActive ? 'text-green-700' : 'text-gray-400'}`}>{step.label}</span>
                    </div>
                    {index < STATUS_STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 ${index < currentStepIndex ? 'bg-green-300' : 'bg-gray-200'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">Items</h3>
          <div className="space-y-3">
            {order.items?.map((item) => (
              <div key={item.id ?? item.menuItemId} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium">{item.menuItemName}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="font-medium">&euro;{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>&euro;{Number(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        {/* Payment & Delivery info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-lg mb-3">Payment</h3>
            {payment ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${PAYMENT_STATUS[payment.status]?.color || ''}`}>
                    {PAYMENT_STATUS[payment.status]?.label || payment.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Method</span>
                  <span className="font-medium capitalize">{payment.paymentMethod?.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-medium">&euro;{Number(payment.amount).toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No payment info available.</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-lg mb-3">Delivery</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Address</span>
                <span className="font-medium text-right max-w-[60%]">{order.deliveryAddress || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rating section — only for delivered orders */}
        {order.status === 'DELIVERED' && user && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
            <h3 className="font-semibold text-lg mb-4">
              {existingRating && !isEditing ? 'Your Review' : 'Rate This Order'}
            </h3>

            {existingRating && !isEditing ? (
              <div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${star <= existingRating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">{existingRating.rating}/5</span>
                </div>
                {existingRating.comment && (
                  <p className="text-sm text-gray-600 mb-3">{existingRating.comment}</p>
                )}
                <p className="text-xs text-gray-400 mb-4">
                  {new Date(existingRating.createdAt).toLocaleString()}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteRating}
                    className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRatingValue(star)}
                      className="p-0.5 transition"
                    >
                      <Star
                        className={`w-8 h-8 transition ${
                          star <= (hoverRating || ratingValue)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      />
                    </button>
                  ))}
                  {ratingValue > 0 && (
                    <span className="ml-2 text-sm text-gray-500">{ratingValue}/5</span>
                  )}
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment (optional)..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 resize-none mb-4"
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSubmitRating}
                    disabled={ratingSubmitting || ratingValue < 1}
                    className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {ratingSubmitting && 'Submitting...'}
                    {!ratingSubmitting && isEditing && 'Update Review'}
                    {!ratingSubmitting && !isEditing && 'Submit Review'}
                  </button>
                  {isEditing && (
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setRatingValue(existingRating.rating);
                        setComment(existingRating.comment || '');
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-2"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
            {ratingMsg && (
              <p className={`mt-3 text-sm ${ratingMsg.includes('Failed') ? 'text-red-500' : 'text-green-600'}`}>
                {ratingMsg}
              </p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetail;
