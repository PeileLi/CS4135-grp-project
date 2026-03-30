import api from './api';

export const registerDriver = (data) => {
  return api.post('/drivers', data);
};

export const getDriverByUserId = (userId) => {
  return api.get(`/drivers/user/${userId}`);
};

export const getDriver = (driverId) => {
  return api.get(`/drivers/${driverId}`);
};

export const updateDriverStatus = (driverId, available) => {
  return api.patch(`/drivers/${driverId}/status?available=${available}`);
};

export const acceptDelivery = (driverId, deliveryId) => {
  return api.post(`/drivers/${driverId}/accept-delivery/${deliveryId}`);
};

export const updateDeliveryStatus = (deliveryId, status) => {
  return api.patch(`/drivers/delivery/${deliveryId}/status?status=${status}`);
};

export const getDriverDeliveries = (driverId) => {
  return api.get(`/drivers/${driverId}/deliveries`);
};

export const getDriverEarnings = (driverId) => {
  return api.get(`/drivers/${driverId}/earnings`);
};

export const getAvailableDeliveries = () => {
  return api.get('/deliveries/available');
};

export const getCurrentDelivery = (driverId) => {
  return api.get(`/drivers/${driverId}/current-delivery`);
};
