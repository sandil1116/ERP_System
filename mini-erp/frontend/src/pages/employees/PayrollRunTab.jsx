import { useEffect, useState } from 'react'
import { PlayCircle, CheckCircle2, History } from 'lucide-react'
import { payrollApi } from '../../api/payrollApi'

export default function PayrollRunTab() {
  const [preview, setPreview] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)
  const [showHistory, setShowHistory] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([payrollApi.preview(), payrollApi.history()])
      .then(([p, h]) => { setPreview(p); setHistory(h) })
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleRun = async () => {
    if (!confirm(`Run payroll for ${preview.entries.length} employee(s), total LKR ${preview.totalPay.toFixed(2)}? This cannot be undone.`)) return
    setRunning(true)
    setError('')
    try {
      const run = await payrollApi.run()
      setSuccess(run)
      load()
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not run payroll.')
    } finally {
      setRunning(false)
    }
  }

  if (loading) return <p className="text-sm text-slate-500 dark:text-slate-400">Loading…</p>

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Loan and advance installments are deducted automatically — you don't need to calculate anything by hand.
        </p>
        <button className="btn-secondary" onClick={() => setShowHistory((v) => !v)}>
          <History size={16} /> {showHistory ? 'Hide history' : 'View history'}
        </button>
      </div>

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-card border border-ledger-500/30 bg-ledger-500/10 p-3 text-sm text-ledger-700 dark:text-ledger-300">
          <CheckCircle2 size={16} />
          Payroll processed — LKR {success.totalPaid.toFixed(2)} paid to {success.entries.length} employee(s).
        </div>
      )}

      {showHistory ? (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Processed by</th>
                <th className="px-5 py-3 font-medium">Employees</th>
                <th className="px-5 py-3 font-medium text-right">Total paid</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{new Date(h.processedAt).toLocaleString()}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{h.processedByName}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{h.entries.length}</td>
                  <td className="figure px-5 py-3 text-right text-slate-800 dark:text-slate-100">{h.totalPaid.toFixed(2)}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-400">No payroll runs yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Employee</th>
                  <th className="px-5 py-3 font-medium text-right">Base salary</th>
                  <th className="px-5 py-3 font-medium text-right">Loan deduction</th>
                  <th className="px-5 py-3 font-medium text-right">Net pay</th>
                </tr>
              </thead>
              <tbody>
                {preview?.entries.map((e) => (
                  <tr key={e.employeeId} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">{e.employeeName}</td>
                    <td className="figure px-5 py-3 text-right text-slate-600 dark:text-slate-300">{e.baseSalary.toFixed(2)}</td>
                    <td className="figure px-5 py-3 text-right text-rust-500">{e.deduction > 0 ? `− ${e.deduction.toFixed(2)}` : '—'}</td>
                    <td className="figure px-5 py-3 text-right font-medium text-slate-800 dark:text-slate-100">{e.netPay.toFixed(2)}</td>
                  </tr>
                ))}
                {preview?.entries.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-400">No active employees to pay.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {preview?.entries.length > 0 && (
            <div className="card mt-4 flex items-center justify-between p-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Total to pay this run</p>
                <p className="figure text-2xl font-semibold text-slate-800 dark:text-slate-100">LKR {preview.totalPay.toFixed(2)}</p>
              </div>
              <button className="btn-primary" onClick={handleRun} disabled={running}>
                <PlayCircle size={16} /> {running ? 'Processing…' : 'Run payroll'}
              </button>
            </div>
          )}

          {error && <p className="mt-3 text-sm text-rust-500">{error}</p>}
        </>
      )}
    </div>
  )
}
