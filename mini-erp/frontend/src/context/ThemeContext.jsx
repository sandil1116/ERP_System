import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../api/authApi'
import { useAuth } from './AuthContext'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('mini-erp-theme') || 'light')

  // Apply the .dark class to <html> so every Tailwind dark: utility reacts.
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('mini-erp-theme', theme)
  }, [theme])

  const { user } = useAuth() || {}

  // Once logged in, adopt the theme saved on the user's profile so it
  // follows them across devices instead of only living in this browser.
  useEffect(() => {
    if (user?.theme) {
      setTheme(user.theme)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const toggleTheme = async () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    if (user) {
      try {
        await authApi.updateTheme(next)
      } catch {
        // non-critical - the UI already switched, saving the preference can fail silently
      }
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
