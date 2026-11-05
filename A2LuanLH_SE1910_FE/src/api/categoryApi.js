import axiosClient from './axiosClient';

export const categoryApi = {
  getAll: (search = '') => axiosClient.get(`/categories${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getActive: () => axiosClient.get('/categories/active'),
  getById: (id) => axiosClient.get(`/categories/${id}`),
  create: (data) => axiosClient.post('/categories', data),
  update: (id, data) => axiosClient.put(`/categories/${id}`, data),
  delete: (id) => axiosClient.delete(`/categories/${id}`),
};

