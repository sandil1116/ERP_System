import axiosClient from './axiosClient'

export const saleApi = {
  list: () => axiosClient.get('/sales').then((res) => res.data),
  getOne: (id) => axiosClient.get(`/sales/${id}`).then((res) => res.data),
  create: (payload) => axiosClient.post('/sales', payload).then((res) => res.data),
}
