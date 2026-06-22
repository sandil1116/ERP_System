import { useEffect, useState } from 'react'
import { Plus, Lock } from 'lucide-react'
import { accountApi } from '../../api/accountApi'
import Modal from '../../components/Modal'
import RowActions from '../../components/RowActions'

const emptyForm = { name: '', balance: '' }

export default function AccountBalancesTab() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const load = () => {
    setLoading(true)
    accountApi.list().then(setAccounts).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setFormError(''); setModalOpen(true) }
  const openEdit = (a) => { setEditing(a); setForm({ name: a.name, balance: a.balance }); setFormError(''); setModalOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    const payload = { name: form.name, balance: Number(form.balance) }
    try {
      if (editing) {
        const updated = await accountApi.update(editing.id, payload)
        setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
      } else {
        const created = await accountApi.create(payload)
        setAccounts((prev) => [...prev, created])
      }
      setModalOpen(false)
    } catch (err) {
      setFormError(err?.response?.data?.error || 'Could not save this account.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (a) => {
    if (!confirm(`Remove ${a.name}?`)) return
    await accountApi.remove(a.id)
    setAccounts((prev) => prev.filter((x) => x.id !== a.id))
  }

  const total = accounts.reduce((sum, a) => sum + a.balance, 0)

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          "Cash" updates automatically from every sale, purchase, and expense. Add other accounts (e.g. a bank
          account) to track their balance manually.
        </p>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add account</button>
      </div>

      <div className="mb-4 card p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Total across all accounts</p>
        <p className="figure mt-1 text-2xl font-semibold text-slate-800 dark:text-slate-100">LKR {total.toFixed(2)}</p>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <p className="p-5 text-sm text-slate-500 dark:text-slate-400">Loading…</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Account</th>
                <th className="px-5 py-3 font-medium text-right">Balance</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">
                    {a.name} {a.isSystem && <span className="ml-1 text-xs font-normal text-slate-400">(auto-tracked)</span>}
                  </td>
                  <td className="figure px-5 py-3 text-right text-slate-800 dark:text-slate-100">{a.balance.toFixed(2)}</td>
                  <td className="px-5 py-3 text-right">
                    {a.isSystem ? (
                      <span className="icon-btn cursor-default opacity-40" title="Automatically calculated"><Lock size={16} /></span>
                    ) : (
                      <RowActions onEdit={() => openEdit(a)} onDelete={() => handleDelete(a)} deleteLabel="Remove" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit account' : 'Add account'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave}>
            <div className="mb-3">
              <label className="label">Account name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Bank of Ceylon" required />
            </div>
            <div className="mb-3">
              <label className="label">Current balance</label>
              <input type="number" step="0.01" className="input" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })} required />
            </div>
            <p className="mb-3 text-xs text-slate-400">This balance is tracked manually — update it whenever you check your actual bank balance.</p>
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
