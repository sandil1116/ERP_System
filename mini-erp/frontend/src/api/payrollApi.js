import axiosClient from './axiosClient'

export const payrollApi = {
  preview: () => axiosClient.get('/payroll/preview').then((res) => res.data),
  run: () => axiosClient.post('/payroll/run').then((res) => res.data),
  history: () => axiosClient.get('/payroll/history').then((res) => res.data),
}
