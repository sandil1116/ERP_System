import axiosClient from './axiosClient'

export const productApi = {
  list: () => axiosClient.get('/products').then((res) => res.data),
  create: (payload) => axiosClient.post('/products', payload).then((res) => res.data),
  update: (id, payload) => axiosClient.put(`/products/${id}`, payload).then((res) => res.data),
  adjustStock: (id, quantity, reason) =>
    axiosClient.patch(`/products/${id}/stock`, { quantity, reason }).then((res) => res.data),
  remove: (id) => axiosClient.delete(`/products/${id}`).then((res) => res.data),
}
