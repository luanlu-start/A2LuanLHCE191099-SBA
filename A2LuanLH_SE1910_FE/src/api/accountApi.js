import axiosClient from './axiosClient';

export const accountApi = {
  getAll: (search = '') => axiosClient.get(`/accounts${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getById: (id) => axiosClient.get(`/accounts/${id}`),
  create: (data) => axiosClient.post('/accounts', data),
  update: (id, data) => axiosClient.put(`/accounts/${id}`, data),
  delete: (id) => axiosClient.delete(`/accounts/${id}`),
  updateProfile: (id, data) => axiosClient.put(`/accounts/${id}/profile`, data),
};

