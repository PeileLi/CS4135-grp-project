import api from './api';

export const createPayment = (data) => {
  return api.post('/payments', data);
};

export const processPayment = (paymentId, data) => {
  return api.post(`/payments/${paymentId}/process`, data);
};

export const getPaymentByOrder = (orderId) => {
  return api.get(`/payments/order/${orderId}`);
};

export const getPaymentMethods = () => {
  return api.get('/payments/methods');
};
