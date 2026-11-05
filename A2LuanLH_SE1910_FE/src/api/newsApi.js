import axiosClient from './axiosClient';

export const newsApi = {
  getPublic: (search = '') => axiosClient.get(`/news/public${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getAll: (search = '') => axiosClient.get(`/news${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getHistory: (staffId) => axiosClient.get(`/news/history?staffId=${staffId}`),
  getById: (id) => axiosClient.get(`/news/${id}`),
  create: (data, staffId) => axiosClient.post(`/news${staffId ? `?staffId=${staffId}` : ''}`, data),
  update: (id, data, staffId) => axiosClient.put(`/news/${id}${staffId ? `?staffId=${staffId}` : ''}`, data),
  delete: (id) => axiosClient.delete(`/news/${id}`),
};

