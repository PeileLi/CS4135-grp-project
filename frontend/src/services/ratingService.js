import api from './api';

export const createRating = (ratingData) => {
  return api.post('/ratings', ratingData);
};

export const getRatingsByRestaurant = (restaurantId) => {
  return api.get(`/ratings/restaurant/${restaurantId}`);
};

export const getRatingsByUser = (userId) => {
  return api.get(`/ratings/user/${userId}`);
};

export const getAverageRating = (restaurantId) => {
  return api.get(`/ratings/restaurant/${restaurantId}/average`);
};

export const updateRating = (ratingId, data) => {
  return api.put(`/ratings/${ratingId}`, data);
};

export const deleteRating = (ratingId) => {
  return api.delete(`/ratings/${ratingId}`);
};

export const getRatingByOrder = (orderId, userId) => {
  return api.get(`/ratings/user/${userId}`).then(res => {
    const match = res.data.find(r => r.orderId === orderId);
    return { data: match || null };
  });
};
