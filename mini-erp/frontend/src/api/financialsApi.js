import axiosClient from './axiosClient'

export const financialsApi = {
  summary: (from, to) => axiosClient.get('/financials/summary', { params: { from, to } }).then((res) => res.data),
  cashFlow: (from, to) => axiosClient.get('/financials/cash-flow', { params: { from, to } }).then((res) => res.data),
  ledger: (from, to) => axiosClient.get('/financials/ledger', { params: { from, to } }).then((res) => res.data),
}
