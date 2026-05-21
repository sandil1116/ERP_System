import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('mini-erp-user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(true)

  // On first load, if we have a token, re-fetch the fresh profile
  // (covers the case where an admin changed this user's role elsewhere).
  useEffect(() => {
    const token = localStorage.getItem('mini-erp-token')
    if (!token) {
      setLoading(false)
      return
    }
    authApi
      .me()
      .then((profile) => {
        setUser(profile)
        localStorage.setItem('mini-erp-user', JSON.stringify(profile))
      })
      .catch(() => {
        localStorage.removeItem('mini-erp-token')
        localStorage.removeItem('mini-erp-user')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const { token, user: loggedInUser } = await authApi.login(email, password)
    localStorage.setItem('mini-erp-token', token)
    localStorage.setItem('mini-erp-user', JSON.stringify(loggedInUser))
    setUser(loggedInUser)
    return loggedInUser
  }

  const bootstrap = async (name, email, password) => {
    const { token, user: newUser } = await authApi.bootstrap(name, email, password)
    localStorage.setItem('mini-erp-token', token)
    localStorage.setItem('mini-erp-user', JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    localStorage.removeItem('mini-erp-token')
    localStorage.removeItem('mini-erp-user')
    setUser(null)
  }

  const hasRole = (...roles) => !!user && roles.includes(user.role)

  return (
    <AuthContext.Provider value={{ user, loading, login, bootstrap, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
