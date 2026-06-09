import { useEffect, useState } from 'react'
import { purchaseApi } from '../../api/purchaseApi'

export default function PurchaseHistoryTab() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    purchaseApi.list().then(setPurchases).finally(() => setLoading(false))
  }, [])

  const filtered = purchases.filter((p) => filter === 'ALL' || p.paymentType === filter)

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        {['ALL', 'CASH', 'CREDIT'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === f ? 'bg-ledger-500 text-white' : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300'
            }`}>
            {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <p className="p-5 text-sm text-slate-500 dark:text-slate-400">Loading…</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Supplier</th>
                <th className="px-5 py-3 font-medium">Recorded by</th>
                <th className="px-5 py-3 font-medium">Items</th>
                <th className="px-5 py-3 font-medium">Payment</th>
                <th className="px-5 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{new Date(p.createdAt).toLocaleString()}</td>
                  <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">{p.supplierName}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{p.staffName}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{p.items.length} item{p.items.length !== 1 ? 's' : ''}</td>
                  <td className="px-5 py-3">
                    <span className={p.paymentType === 'CASH' ? 'badge bg-ledger-500/15 text-ledger-700 dark:text-ledger-300' : 'badge bg-amber-500/15 text-amber-500'}>
                      {p.paymentType}
                    </span>
                  </td>
                  <td className="figure px-5 py-3 text-right text-slate-800 dark:text-slate-100">{p.total.toFixed(2)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-400">No purchases yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
