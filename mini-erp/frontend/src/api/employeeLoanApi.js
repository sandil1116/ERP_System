import axiosClient from './axiosClient'

export const employeeLoanApi = {
  listForEmployee: (employeeId) =>
    axiosClient.get('/employee-loans', { params: { employeeId } }).then((res) => res.data),
  create: (payload) => axiosClient.post('/employee-loans', payload).then((res) => res.data),
}
