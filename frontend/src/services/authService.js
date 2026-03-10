import api from './api';

export const loginAPI = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const registerAPI = (name, email, password) => {
  return api.post('/auth/register', { name, email, password, role: 'CUSTOMER' });
};
