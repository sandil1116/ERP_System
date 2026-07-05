import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { employeeLoanApi } from '../../api/employeeLoanApi'
import Modal from '../../components/Modal'

const emptyForm = { type: 'LOAN', principal: '', installmentAmount: '', frequency: 'MONTHLY' }

export default function EmployeeLoansModal({ employee, onClose }) {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    employeeLoanApi.listForEmployee(employee.id).then(setLoans).finally(() => setLoading(false))
  }
  useEffect(load, [employee.id])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await employeeLoanApi.create({
        employeeId: employee.id,
        type: form.type,
        principal: Number(form.principal),
        installmentAmount: form.type === 'LOAN' ? Number(form.installmentAmount) : undefined,
        frequency: form.type === 'LOAN' ? form.frequency : undefined,
      })
      setFormOpen(false)
      setForm(emptyForm)
      load()
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not record this loan/advance.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={`Loans & advances — ${employee.name}`} onClose={onClose}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Deductions apply automatically on the next payroll run.
        </p>
        <button className="btn-secondary" onClick={() => setFormOpen((v) => !v)}>
          <Plus size={16} /> {formOpen ? 'Cancel' : 'New'}
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSave} className="mb-4 rounded-card border border-dashed border-slate-300 p-3 dark:border-slate-600">
          <div className="mb-3">
            <label className="label">Type</label>
            <div className="flex gap-2">
              {['LOAN', 'ADVANCE'].map((t) => (
                <button key={t} type="button" onClick={() => setForm({ ...form, type: t })}
                  className={`flex-1 rounded-card border px-3 py-2 text-sm font-medium transition-colors ${
                    form.type === t ? 'border-ledger-500 bg-ledger-500/10 text-ledger-700 dark:text-ledger-300' : 'border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400'
                  }`}>
                  {t === 'LOAN' ? 'Loan' : 'Advance'}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="label">{form.type === 'LOAN' ? 'Loan amount' : 'Advance amount'}</label>
            <input type="number" step="0.01" min="0.01" className="input" value={form.principal} onChange={(e) => setForm({ ...form, principal: e.target.value })} required />
          </div>

          {form.type === 'LOAN' && (
            <div className="mb-3 grid grid-cols-2 gap-3">
              <div>
                <label className="label">Installment per payroll</label>
                <input type="number" step="0.01" min="0.01" className="input" value={form.installmentAmount} onChange={(e) => setForm({ ...form, installmentAmount: e.target.value })} required />
              </div>
              <div>
                <label className="label">Frequency</label>
                <select className="input" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>
            </div>
          )}
          {form.type === 'ADVANCE' && (
            <p className="mb-3 text-xs text-slate-400">The full amount will be deducted from this employee's very next payroll run.</p>
          )}

          {error && <p className="mb-3 text-sm text-rust-500">{error}</p>}
          <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
            {saving ? 'Saving…' : `Give ${form.type === 'LOAN' ? 'loan' : 'advance'}`}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading…</p>
      ) : loans.length === 0 ? (
        <p className="py-4 text-center text-sm text-slate-400">No loans or advances yet.</p>
      ) : (
        <div className="space-y-2">
          {loans.map((l) => {
            const paidBack = l.principal - l.balanceRemaining
            const pct = l.principal > 0 ? Math.round((paidBack / l.principal) * 100) : 0
            return (
              <div key={l.id} className="rounded-card border border-slate-200 p-3 dark:border-slate-700">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-800 dark:text-slate-100">
                    {l.type === 'LOAN' ? 'Loan' : 'Advance'} — LKR {l.principal.toFixed(2)}
                  </span>
                  <span className={l.status === 'COMPLETED' ? 'badge bg-ledger-500/15 text-ledger-700 dark:text-ledger-300' : 'badge bg-amber-500/15 text-amber-500'}>
                    {l.status === 'COMPLETED' ? 'Settled' : 'Active'}
                  </span>
                </div>
                <div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div className="h-full bg-ledger-500" style={{ width: `${pct}%` }} />
                </div>
                <p className="figure text-xs text-slate-500 dark:text-slate-400">
                  LKR {l.balanceRemaining.toFixed(2)} remaining
                  {l.type === 'LOAN' && ` · LKR ${l.installmentAmount.toFixed(2)} / ${l.frequency.toLowerCase()}`}
                </p>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button className="btn-secondary" onClick={onClose}>Close</button>
      </div>
    </Modal>
  )
}
