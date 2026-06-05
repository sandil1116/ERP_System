import axiosClient from './axiosClient'

export const purchaseApi = {
  list: () => axiosClient.get('/purchases').then((res) => res.data),
  getOne: (id) => axiosClient.get(`/purchases/${id}`).then((res) => res.data),
  create: (payload) => axiosClient.post('/purchases', payload).then((res) => res.data),
}
