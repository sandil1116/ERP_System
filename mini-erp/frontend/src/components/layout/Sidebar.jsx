import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingCart, Truck, Boxes,
  Wallet, Users2, Settings, Lock,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

// Every module from the system design doc. Modules beyond Phase 1 are
// shown but locked so the full shape of the system is visible from day one.
const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: null, enabled: true },
  { to: '/sales', label: 'Sales & Customers', icon: ShoppingCart, roles: ['ADMIN', 'CASHIER'], enabled: true },
  { to: '/purchases', label: 'Purchases & Suppliers', icon: Truck, roles: ['ADMIN', 'STAFF'], enabled: true },
  { to: '/inventory', label: 'Inventory', icon: Boxes, roles: null, enabled: true },
  { to: '/financials', label: 'Financials', icon: Wallet, roles: ['ADMIN'], enabled: true },
  { to: '/employees', label: 'Employees & Payroll', icon: Users2, roles: ['ADMIN'], enabled: true },
]

export default function Sidebar() {
  const { user, hasRole } = useAuth()

  const visibleItems = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(user?.role))

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-surface-light dark:border-slate-700/60 dark:bg-surface-dark md:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-card bg-ledger-500 font-display text-sm font-bold text-white">
          M
        </div>
        <span className="font-display text-lg font-semibold text-slate-800 dark:text-slate-100">Mini ERP</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {visibleItems.map(({ to, label, icon: Icon, enabled }) => (
          <NavLink
            key={to}
            to={enabled ? to : '#'}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-card px-3 py-2 text-sm font-medium transition-colors ${
                enabled
                  ? isActive
                    ? 'bg-ledger-500/15 text-ledger-700 dark:text-ledger-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'
                  : 'cursor-not-allowed text-slate-400 dark:text-slate-600'
              }`
            }
            onClick={(e) => !enabled && e.preventDefault()}
          >
            <span className="flex items-center gap-2.5">
              <Icon size={17} />
              {label}
            </span>
            {!enabled && <Lock size={13} />}
          </NavLink>
        ))}
      </nav>

      {hasRole('ADMIN') && (
        <div className="border-t border-slate-200 px-3 py-3 dark:border-slate-700/60">
          <NavLink
            to="/settings/users"
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-card px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-ledger-500/15 text-ledger-700 dark:text-ledger-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'
              }`
            }
          >
            <Settings size={17} />
            Settings & Users
          </NavLink>
        </div>
      )}
    </aside>
  )
}
