import api from './axios';
export const getDeals    = (params) => api.get('/deals', { params });
export const createDeal  = (data)   => api.post('/deals', data);
export const updateDeal  = (id, data) => api.put(`/deals/${id}`, data);
export const deleteDeal  = (id)     => api.delete(`/deals/${id}`);