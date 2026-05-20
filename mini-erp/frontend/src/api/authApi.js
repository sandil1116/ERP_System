import axiosClient from './axiosClient'

export const authApi = {
  login: (email, password) =>
    axiosClient.post('/auth/login', { email, password }).then((res) => res.data),

  bootstrap: (name, email, password) =>
    axiosClient.post('/auth/bootstrap', { name, email, password }).then((res) => res.data),

  needsBootstrap: () =>
    axiosClient.get('/auth/needs-bootstrap').then((res) => res.data.needsBootstrap),

  me: () => axiosClient.get('/me').then((res) => res.data),

  updateTheme: (theme) => axiosClient.put('/me/theme', { theme }).then((res) => res.data),
}
