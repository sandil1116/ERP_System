import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react'
import { financialsApi } from '../../api/financialsApi'
import { getPresetRange } from '../../utils/dateRanges'
import PeriodPicker from './PeriodPicker'

export default function ProfitLossTab() {
  const [preset, setPreset] = useState('today')
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { from, to } = getPresetRange(preset)
    setLoading(true)
    financialsApi.summary(from, to).then(setSummary).finally(() => setLoading(false))
  }, [preset])

  return (
    <div>
      <PeriodPicker preset={preset} onChange={setPreset} />

      {loading || !summary ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Revenue" value={summary.revenue} icon={DollarSign} tone="ledger" />
            <StatCard label="Cost of Goods Sold" value={summary.cogs} icon={TrendingDown} tone="amber" />
            <StatCard label="Expenses" value={summary.expenses} icon={TrendingDown} tone="rust" />
            <StatCard label="Net Profit" value={summary.netProfit} icon={summary.netProfit >= 0 ? TrendingUp : TrendingDown} tone={summary.netProfit >= 0 ? 'ledger' : 'rust'} emphasize />
          </div>

          <div className="card mt-5 p-5">
            <h2 className="mb-3 font-display text-base font-semibold text-slate-800 dark:text-slate-100">How this is calculated</h2>
            <div className="figure space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
              <p>Revenue &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LKR {summary.revenue.toFixed(2)}</p>
              <p>− Cost of Goods &nbsp;LKR {summary.cogs.toFixed(2)}</p>
              <p>− Expenses &nbsp;&nbsp;&nbsp;&nbsp;LKR {summary.expenses.toFixed(2)}</p>
              <p className="border-t border-slate-200 pt-1.5 font-semibold text-slate-800 dark:border-slate-700 dark:text-slate-100">
                = Net Profit &nbsp;&nbsp;LKR {summary.netProfit.toFixed(2)}
              </p>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Revenue counts every sale in this period (cash + credit). Cost of Goods uses each product's cost price
              at the moment it was sold, so later price changes don't retroactively change past reports.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ label, value, icon: Icon, tone, emphasize }) {
  const toneClasses = {
    ledger: 'text-ledger-500',
    amber: 'text-amber-500',
    rust: 'text-rust-500',
  }
  return (
    <div className={`card p-4 ${emphasize ? 'ring-1 ring-ledger-500/30' : ''}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
        <Icon size={16} className={toneClasses[tone]} />
      </div>
      <p className="figure text-2xl font-semibold text-slate-800 dark:text-slate-100">
        <span className="mr-1 text-sm font-normal text-slate-400">LKR</span>
        {value.toFixed(2)}
      </p>
    </div>
  )
}
