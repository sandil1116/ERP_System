import axiosClient from './axiosClient'

export const accountApi = {
  list: () => axiosClient.get('/accounts').then((res) => res.data),
  create: (payload) => axiosClient.post('/accounts', payload).then((res) => res.data),
  update: (id, payload) => axiosClient.put(`/accounts/${id}`, payload).then((res) => res.data),
  remove: (id) => axiosClient.delete(`/accounts/${id}`).then((res) => res.data),
}
