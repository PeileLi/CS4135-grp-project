import api from './api';

export const loginAPI = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const registerAPI = (email, password) => {
  return api.post('/auth/register', { email, password, role: 'CUSTOMER' });
};
