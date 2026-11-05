import axiosClient from './axiosClient';

export const tagApi = {
  getAll: () => axiosClient.get('/tags'),
  getById: (id) => axiosClient.get(`/tags/${id}`),
};

