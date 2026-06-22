import { useEffect, useState } from 'react'
import { financialsApi } from '../../api/financialsApi'
import { getPresetRange } from '../../utils/dateRanges'
import PeriodPicker from './PeriodPicker'

const TYPE_LABELS = {
  SALE_CASH: 'Cash sale',
  PURCHASE_CASH: 'Cash purchase',
  EXPENSE: 'Expense',
  RECEIVABLE_PAYMENT: 'Customer payment received',
  PAYABLE_PAYMENT: 'Supplier payment made',
  SALARY_PAYMENT: 'Salary paid',
  LOAN_GIVEN: 'Employee loan given',
  ADVANCE_GIVEN: 'Employee advance given',
}

export default function CashFlowTab() {
  const [preset, setPreset] = useState('today')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { from, to } = getPresetRange(preset)
    setLoading(true)
    financialsApi.cashFlow(from, to).then(setData).finally(() => setLoading(false))
  }, [preset])

  return (
    <div>
      <PeriodPicker preset={preset} onChange={setPreset} />

      {loading || !data ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading…</p>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Opening balance</p>
              <p className="figure mt-1 text-xl font-semibold text-slate-800 dark:text-slate-100">LKR {data.openingBalance.toFixed(2)}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Closing balance</p>
              <p className="figure mt-1 text-xl font-semibold text-slate-800 dark:text-slate-100">LKR {data.closingBalance.toFixed(2)}</p>
            </div>
          </div>

          <div className="card overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="px-5 py-3 font-medium text-right">Amount</th>
                  <th className="px-5 py-3 font-medium text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {data.entries.map((e) => (
                  <tr key={e.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{new Date(e.createdAt).toLocaleString()}</td>
                    <td className="px-5 py-3 text-slate-800 dark:text-slate-100">
                      {TYPE_LABELS[e.type] || e.type}
                      {e.note && <span className="ml-1 text-xs text-slate-400">— {e.note}</span>}
                    </td>
                    <td className={`figure px-5 py-3 text-right font-medium ${e.direction === 'IN' ? 'text-ledger-600 dark:text-ledger-300' : 'text-rust-500'}`}>
                      {e.direction === 'IN' ? '+' : '−'} {e.amount.toFixed(2)}
                    </td>
                    <td className="figure px-5 py-3 text-right text-slate-600 dark:text-slate-300">{e.runningBalance.toFixed(2)}</td>
                  </tr>
                ))}
                {data.entries.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-400">No cash movement in this period.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
