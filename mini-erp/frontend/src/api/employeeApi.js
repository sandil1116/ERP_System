import axiosClient from './axiosClient'

export const employeeApi = {
  list: () => axiosClient.get('/employees').then((res) => res.data),
  create: (payload) => axiosClient.post('/employees', payload).then((res) => res.data),
  update: (id, payload) => axiosClient.put(`/employees/${id}`, payload).then((res) => res.data),
  remove: (id) => axiosClient.delete(`/employees/${id}`).then((res) => res.data),
}
