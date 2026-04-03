import api from './api';

export const getRestaurants = () => {
  return api.get('/restaurants');
};

export const getRestaurantById = (id) => {
  return api.get(`/restaurants/${id}`);
};

export const getRestaurantsByOwner = (ownerId) => {
  return api.get(`/restaurants/owner/${ownerId}`);
};

export const getMenuByRestaurantId = (restaurantId) => {
  return api.get(`/restaurants/${restaurantId}/menu`);
};

export const createRestaurant = (restaurant) => {
  return api.post('/restaurants', restaurant);
};

export const updateRestaurant = (id, restaurant) => {
  return api.put(`/restaurants/${id}`, restaurant);
};

export const deleteRestaurant = (id) => {
  return api.delete(`/restaurants/${id}`);
};

export const toggleRestaurantOpen = (id) => {
  return api.put(`/restaurants/${id}/toggle-open`);
};

export const addMenuItem = (restaurantId, menuItem) => {
  return api.post(`/restaurants/${restaurantId}/menu`, menuItem);
};

export const updateMenuItem = (restaurantId, itemId, menuItem) => {
  return api.put(`/restaurants/${restaurantId}/menu/${itemId}`, menuItem);
};

export const deleteMenuItem = (restaurantId, itemId) => {
  return api.delete(`/restaurants/${restaurantId}/menu/${itemId}`);
};
