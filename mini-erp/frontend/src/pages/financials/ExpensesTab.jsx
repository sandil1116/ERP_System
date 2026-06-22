import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { expenseApi } from '../../api/expenseApi'
import Modal from '../../components/Modal'

const emptyForm = { category: '', amount: '', note: '' }

export default function ExpensesTab() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const load = () => {
    setLoading(true)
    expenseApi.list().then(setExpenses).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openAdd = () => { setForm(emptyForm); setFormError(''); setModalOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      const created = await expenseApi.create({ category: form.category, amount: Number(form.amount), note: form.note })
      setExpenses((prev) => [created, ...prev])
      setModalOpen(false)
    } catch (err) {
      setFormError(err?.response?.data?.error || 'Could not save this expense.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this expense?')) return
    await expenseApi.remove(id)
    setExpenses((prev) => prev.filter((x) => x.id !== id))
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">Operating costs not tied to a purchase — rent, utilities, transport, etc.</p>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add expense</button>
      </div>

      <div className="mb-4 card p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Total recorded</p>
        <p className="figure mt-1 text-2xl font-semibold text-slate-800 dark:text-slate-100">LKR {total.toFixed(2)}</p>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <p className="p-5 text-sm text-slate-500 dark:text-slate-400">Loading…</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Note</th>
                <th className="px-5 py-3 font-medium text-right">Amount</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{new Date(e.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">{e.category}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{e.note || '—'}</td>
                  <td className="figure px-5 py-3 text-right text-rust-500">{e.amount.toFixed(2)}</td>
                  <td className="px-5 py-3 text-right">
                    <button className="icon-btn hover:!bg-rust-500/10 hover:!text-rust-500" title="Remove" onClick={() => handleDelete(e.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-400">No expenses recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title="Add expense" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave}>
            <div className="mb-3">
              <label className="label">Category</label>
              <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Rent, Electricity, Transport" required />
            </div>
            <div className="mb-3">
              <label className="label">Amount</label>
              <input type="number" step="0.01" min="0.01" className="input" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="label">Note (optional)</label>
              <input className="input" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            </div>
            {formError && <p className="mb-3 text-sm text-rust-500">{formError}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
