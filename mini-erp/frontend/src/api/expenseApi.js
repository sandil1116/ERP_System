import axiosClient from './axiosClient'

export const expenseApi = {
  list: () => axiosClient.get('/expenses').then((res) => res.data),
  create: (payload) => axiosClient.post('/expenses', payload).then((res) => res.data),
  remove: (id) => axiosClient.delete(`/expenses/${id}`).then((res) => res.data),
}
