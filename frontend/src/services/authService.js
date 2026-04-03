import api from './api';

export const loginAPI = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const registerAPI = (email, password) => {
  return api.post('/auth/register', { email, password });
};

export const upgradeRoleAPI = (role) => {
  return api.put('/users/upgrade-role', { role });
};
