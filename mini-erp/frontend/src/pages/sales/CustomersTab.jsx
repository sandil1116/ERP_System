import { useEffect, useState } from 'react'
import { Plus, Wallet } from 'lucide-react'
import { customerApi } from '../../api/customerApi'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/Modal'
import RowActions from '../../components/RowActions'

const emptyForm = { name: '', contact: '', type: 'CASH' }

export default function CustomersTab() {
  const { hasRole } = useAuth()
  const isAdmin = hasRole('ADMIN')

  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [payTarget, setPayTarget] = useState(null)
  const [payAmount, setPayAmount] = useState('')
  const [payError, setPayError] = useState('')

  const load = () => {
    setLoading(true)
    customerApi.list().then(setCustomers).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setFormError(''); setModalOpen(true) }
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, contact: c.contact || '', type: c.type }); setFormError(''); setModalOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      if (editing) {
        const updated = await customerApi.update(editing.id, form)
        setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
      } else {
        const created = await customerApi.create(form)
        setCustomers((prev) => [...prev, created])
      }
      setModalOpen(false)
    } catch (err) {
      setFormError(err?.response?.data?.error || 'Could not save this customer.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (c) => {
    if (!confirm(`Remove ${c.name}?`)) return
    await customerApi.remove(c.id)
    setCustomers((prev) => prev.filter((x) => x.id !== c.id))
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    setPayError('')
    try {
      const updated = await customerApi.recordPayment(payTarget.id, Number(payAmount))
      setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
      setPayTarget(null)
      setPayAmount('')
    } catch (err) {
      setPayError(err?.response?.data?.error || 'Could not record payment.')
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">Customers who buy cash, on credit, or weekly.</p>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add customer</button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <p className="p-5 text-sm text-slate-500 dark:text-slate-400">Loading…</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium text-right">Owes us</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">{c.name}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{c.contact || '—'}</td>
                  <td className="px-5 py-3"><span className="badge bg-slate-500/10 text-slate-600 dark:text-slate-300">{c.type}</span></td>
                  <td className="px-5 py-3 text-right">
                    <span className={`figure ${c.creditBalance > 0 ? 'font-medium text-amber-500' : 'text-slate-400'}`}>
                      {c.creditBalance > 0 ? `LKR ${c.creditBalance.toFixed(2)}` : '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      {c.creditBalance > 0 && (
                        <button className="icon-btn" title="Record payment" onClick={() => { setPayTarget(c); setPayAmount(''); setPayError('') }}>
                          <Wallet size={16} />
                        </button>
                      )}
                      {isAdmin && <RowActions onEdit={() => openEdit(c)} onDelete={() => handleDelete(c)} deleteLabel="Remove" />}
                    </div>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-400">No customers yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit customer' : 'Add customer'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave}>
            <div className="mb-3">
              <label className="label">Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="label">Contact</label>
              <input className="input" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Phone number" />
            </div>
            <div className="mb-3">
              <label className="label">Type</label>
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="CASH">Cash</option>
                <option value="CREDIT">Credit</option>
                <option value="RECURRING">Recurring / Weekly</option>
              </select>
            </div>
            {formError && <p className="mb-3 text-sm text-rust-500">{formError}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}

      {payTarget && (
        <Modal title={`Record payment — ${payTarget.name}`} onClose={() => setPayTarget(null)}>
          <form onSubmit={handlePayment}>
            <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
              Outstanding balance: <span className="figure font-medium text-amber-500">LKR {payTarget.creditBalance.toFixed(2)}</span>
            </p>
            <label className="label">Amount received</label>
            <input
              type="number" step="0.01" min="0.01" max={payTarget.creditBalance}
              className="input" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} required autoFocus
            />
            {payError && <p className="mt-2 text-sm text-rust-500">{payError}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setPayTarget(null)}>Cancel</button>
              <button type="submit" className="btn-primary">Record payment</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
