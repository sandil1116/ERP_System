import { LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from '../ThemeToggle'

const ROLE_BADGE_CLASS = {
  ADMIN: 'badge-admin',
  CASHIER: 'badge-cashier',
  STAFF: 'badge-staff',
}

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-surface-light px-5 py-3 dark:border-slate-700/60 dark:bg-surface-dark">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back,</p>
        <p className="font-display text-base font-semibold text-slate-800 dark:text-slate-100">{user?.name}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className={ROLE_BADGE_CLASS[user?.role] || 'badge-staff'}>{user?.role}</span>
        <ThemeToggle />
        <button className="icon-btn" title="Log out" onClick={logout}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
