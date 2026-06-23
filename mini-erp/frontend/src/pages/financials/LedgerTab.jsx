import { useEffect, useState } from 'react'
import { financialsApi } from '../../api/financialsApi'
import { getPresetRange } from '../../utils/dateRanges'
import PeriodPicker from './PeriodPicker'

const TYPE_BADGE = {
  SALE_CASH: 'badge bg-ledger-500/15 text-ledger-700 dark:text-ledger-300',
  SALE_CREDIT: 'badge bg-amber-500/15 text-amber-500',
  PURCHASE_CASH: 'badge bg-rust-500/15 text-rust-500',
  PURCHASE_CREDIT: 'badge bg-amber-500/15 text-amber-500',
  EXPENSE: 'badge bg-rust-500/15 text-rust-500',
  SALARY_PAYMENT: 'badge bg-rust-500/15 text-rust-500',
  LOAN_GIVEN: 'badge bg-amber-500/15 text-amber-500',
  ADVANCE_GIVEN: 'badge bg-amber-500/15 text-amber-500',
}

export default function LedgerTab() {
  const [preset, setPreset] = useState('today')
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { from, to } = getPresetRange(preset)
    setLoading(true)
    financialsApi.ledger(from, to).then(setEntries).finally(() => setLoading(false))
  }, [preset])

  return (
    <div>
      <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
        The complete, unfiltered transaction log — every debit and credit, including credit sales/purchases that
        haven't moved cash yet. This is the source of truth every other Financials page is built from.
      </p>
      <PeriodPicker preset={preset} onChange={setPreset} />

      <div className="card overflow-hidden">
        {loading ? (
          <p className="p-5 text-sm text-slate-500 dark:text-slate-400">Loading…</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Direction</th>
                <th className="px-5 py-3 font-medium">Note</th>
                <th className="px-5 py-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{new Date(e.createdAt).toLocaleString()}</td>
                  <td className="px-5 py-3"><span className={TYPE_BADGE[e.type] || 'badge bg-slate-500/15 text-slate-500'}>{e.type}</span></td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{e.direction}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{e.note}</td>
                  <td className="figure px-5 py-3 text-right text-slate-800 dark:text-slate-100">{e.amount.toFixed(2)}</td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-400">No ledger entries in this period.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
