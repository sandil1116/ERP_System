import axiosClient from './axiosClient'

export const supplierApi = {
  list: () => axiosClient.get('/suppliers').then((res) => res.data),
  create: (payload) => axiosClient.post('/suppliers', payload).then((res) => res.data),
  update: (id, payload) => axiosClient.put(`/suppliers/${id}`, payload).then((res) => res.data),
  remove: (id) => axiosClient.delete(`/suppliers/${id}`).then((res) => res.data),
  recordPayment: (id, amount, note) =>
    axiosClient.post(`/suppliers/${id}/payments`, { amount, note }).then((res) => res.data),
}
