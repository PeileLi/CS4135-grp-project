import api from './api';

export const validateDiscount = (code, orderAmount) => {
  return api.post(`/discounts/validate?code=${encodeURIComponent(code)}&orderAmount=${orderAmount}`);
};

export const applyDiscount = (code, orderAmount) => {
  return api.post(`/discounts/apply?code=${encodeURIComponent(code)}&orderAmount=${orderAmount}`);
};

export const getAllDiscounts = () => {
  return api.get('/discounts');
};
