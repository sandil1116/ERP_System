import { useEffect, useState } from 'react'
import { Boxes, ShoppingCart, Truck, Wallet } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { saleApi } from '../api/saleApi'
import { customerApi } from '../api/customerApi'
import { supplierApi } from '../api/supplierApi'
import { productApi } from '../api/productApi'

function isToday(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

export default function Dashboard() {
  const { user, hasRole } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ todaySales: 0, outstandingCredit: 0, payables: 0, lowStock: 0 })

  useEffect(() => {
    const calls = []

    // Sales figure only fetched for roles that can see Sales (Admin/Cashier).
    calls.push(
      hasRole('ADMIN', 'CASHIER')
        ? saleApi.list().then((sales) => sales.filter((s) => isToday(s.createdAt)).reduce((sum, s) => sum + s.total, 0))
        : Promise.resolve(0)
    )
    calls.push(
      hasRole('ADMIN', 'CASHIER')
        ? customerApi.list().then((customers) => customers.reduce((sum, c) => sum + c.creditBalance, 0))
        : Promise.resolve(0)
    )
    calls.push(
      hasRole('ADMIN', 'STAFF')
        ? supplierApi.list().then((suppliers) => suppliers.reduce((sum, s) => sum + s.payableBalance, 0))
        : Promise.resolve(0)
    )
    calls.push(productApi.list().then((products) => products.filter((p) => p.lowStock).length))

    Promise.all(calls)
      .then(([todaySales, outstandingCredit, payables, lowStock]) => {
        setStats({ todaySales, outstandingCredit, payables, lowStock })
      })
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: "Today's Sales", value: stats.todaySales, icon: ShoppingCart, prefix: 'LKR', show: hasRole('ADMIN', 'CASHIER') },
    { label: 'Outstanding Credit', value: stats.outstandingCredit, icon: Wallet, prefix: 'LKR', show: hasRole('ADMIN', 'CASHIER') },
    { label: 'Payables to Suppliers', value: stats.payables, icon: Truck, prefix: 'LKR', show: hasRole('ADMIN', 'STAFF') },
    { label: 'Low Stock Items', value: stats.lowStock, icon: Boxes, prefix: '', show: true, isCount: true },
  ].filter((c) => c.show)

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-800 dark:text-slate-100">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Live figures from Sales, Purchases, and Inventory — nothing on this page is typed in by hand.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, prefix, isCount }) => (
          <div key={label} className="card p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
              <Icon size={16} className="text-ledger-500" />
            </div>
            <p className="figure text-2xl font-semibold text-slate-800 dark:text-slate-100">
              {loading ? (
                '—'
              ) : (
                <>
                  {prefix && <span className="mr-1 text-sm font-normal text-slate-400">{prefix}</span>}
                  {isCount ? value : value.toFixed(2)}
                </>
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="card mt-6 p-5">
        <h2 className="mb-2 font-display text-base font-semibold text-slate-800 dark:text-slate-100">
          Signed in as {user?.role}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {user?.role === 'ADMIN' &&
            'You have full access, including Financials. Check Profit & Loss under Financials for a deeper breakdown.'}
          {user?.role === 'CASHIER' &&
            'You can process sales and manage customers from the Sales & Customers page.'}
          {user?.role === 'STAFF' &&
            'You can manage inventory stock and view purchase history from the sidebar.'}
        </p>
      </div>
    </div>
  )
}
