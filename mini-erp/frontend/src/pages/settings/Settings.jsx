import { Link } from 'react-router-dom'
import { Moon, Sun, Users2 } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { hasRole } = useAuth()

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-slate-800 dark:text-slate-100">Settings</h1>
      <p className="mt-1 mb-6 text-sm text-slate-500 dark:text-slate-400">
        Appearance, business info, and team management.
      </p>

      <div className="card mb-4 p-5">
        <h2 className="mb-3 font-display text-base font-semibold text-slate-800 dark:text-slate-100">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Theme</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Currently using {theme === 'light' ? 'Light' : 'Dark'} mode. Saved to your profile.
            </p>
          </div>
          <button className="btn-secondary" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            Switch to {theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </div>
      </div>

      {hasRole('ADMIN') && (
        <div className="card p-5">
          <h2 className="mb-3 font-display text-base font-semibold text-slate-800 dark:text-slate-100">Team</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Users & roles</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Add Cashier or Staff accounts, edit roles, or deactivate access.
              </p>
            </div>
            <Link to="/settings/users" className="btn-secondary">
              <Users2 size={16} /> Manage users
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
