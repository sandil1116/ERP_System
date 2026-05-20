import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('mini-erp-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If a token is rejected/expired anywhere in the app, bounce to login.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('mini-erp-token')
      localStorage.removeItem('mini-erp-user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default axiosClient
