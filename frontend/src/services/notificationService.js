import api from './api';

export const getMyNotifications = (userId) => {
  return api.get(`/notifications/user/${userId}`);
};

export const getUnreadCount = (userId) => {
  return api.get(`/notifications/user/${userId}/unread-count`);
};

export const markAsRead = (notificationId) => {
  return api.put(`/notifications/${notificationId}/read`);
};

export const markAllAsRead = (userId) => {
  return api.put(`/notifications/user/${userId}/read-all`);
};
