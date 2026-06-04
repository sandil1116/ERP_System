import axiosClient from './axiosClient'

export const customerApi = {
  list: () => axiosClient.get('/customers').then((res) => res.data),
  create: (payload) => axiosClient.post('/customers', payload).then((res) => res.data),
  update: (id, payload) => axiosClient.put(`/customers/${id}`, payload).then((res) => res.data),
  remove: (id) => axiosClient.delete(`/customers/${id}`).then((res) => res.data),
  recordPayment: (id, amount, note) =>
    axiosClient.post(`/customers/${id}/payments`, { amount, note }).then((res) => res.data),
}
