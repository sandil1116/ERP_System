import axiosClient from './axiosClient'

export const userApi = {
  list: () => axiosClient.get('/users').then((res) => res.data),

  create: (payload) => axiosClient.post('/users', payload).then((res) => res.data),

  update: (id, payload) => axiosClient.put(`/users/${id}`, payload).then((res) => res.data),

  deactivate: (id) => axiosClient.delete(`/users/${id}`).then((res) => res.data),
}
