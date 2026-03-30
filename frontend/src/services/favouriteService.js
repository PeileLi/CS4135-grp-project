import api from './api';

export const addFavourite = (userId, restaurantId) => {
  return api.post('/favourites', { userId, restaurantId });
};

export const getUserFavourites = (userId) => {
  return api.get(`/favourites/user/${userId}`);
};

export const checkFavourite = (userId, restaurantId) => {
  return api.get('/favourites/check', { params: { userId, restaurantId } });
};

export const removeFavourite = (userId, restaurantId) => {
  return api.delete('/favourites', { params: { userId, restaurantId } });
};
