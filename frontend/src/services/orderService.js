import api from './api';

export const createOrder = (orderData) => {
  return api.post('/orders', orderData);
};

export const getMyOrders = () => {
  return api.get('/orders/my');
};

export const getOrderById = (id) => {
  return api.get(`/orders/${id}`);
};

export const cancelOrder = (id) => {
  return api.put(`/orders/${id}/cancel`);
};

export const updateOrderStatus = (id, status) => {
  return api.put(`/orders/${id}/status`, { status });
};

export const getRestaurantOrders = (restaurantId) => {
  return api.get(`/orders/restaurant/${restaurantId}`);
};

export const getRestaurantRevenue = (restaurantId) => {
  return api.get(`/orders/restaurant/${restaurantId}/revenue`);
};
