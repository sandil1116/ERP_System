import { useEffect, useState } from 'react'
import { Plus, Wallet } from 'lucide-react'
import { supplierApi } from '../../api/supplierApi'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/Modal'
import RowActions from '../../components/RowActions'

const emptyForm = { name: '', contact: '' }

export default function SuppliersTab() {
  const { hasRole } = useAuth()
  const isAdmin = hasRole('ADMIN')

  const [suppliers, setSuppliers] = useState([])
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
    supplierApi.list().then(setSuppliers).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setFormError(''); setModalOpen(true) }
  const openEdit = (s) => { setEditing(s); setForm({ name: s.name, contact: s.contact || '' }); setFormError(''); setModalOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      if (editing) {
        const updated = await supplierApi.update(editing.id, form)
        setSuppliers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
      } else {
        const created = await supplierApi.create(form)
        setSuppliers((prev) => [...prev, created])
      }
      setModalOpen(false)
    } catch (err) {
      setFormError(err?.response?.data?.error || 'Could not save this supplier.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (s) => {
    if (!confirm(`Remove ${s.name}?`)) return
    await supplierApi.remove(s.id)
    setSuppliers((prev) => prev.filter((x) => x.id !== s.id))
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    setPayError('')
    try {
      const updated = await supplierApi.recordPayment(payTarget.id, Number(payAmount))
      setSuppliers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
      setPayTarget(null)
      setPayAmount('')
    } catch (err) {
      setPayError(err?.response?.data?.error || 'Could not record payment.')
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">Suppliers you buy stock from.</p>
        {isAdmin && <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add supplier</button>}
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
                <th className="px-5 py-3 font-medium text-right">We owe</th>
                {isAdmin && <th className="px-5 py-3 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">{s.name}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{s.contact || '—'}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`figure ${s.payableBalance > 0 ? 'font-medium text-rust-500' : 'text-slate-400'}`}>
                      {s.payableBalance > 0 ? `LKR ${s.payableBalance.toFixed(2)}` : '—'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        {s.payableBalance > 0 && (
                          <button className="icon-btn" title="Mark as paid" onClick={() => { setPayTarget(s); setPayAmount(''); setPayError('') }}>
                            <Wallet size={16} />
                          </button>
                        )}
                        <RowActions onEdit={() => openEdit(s)} onDelete={() => handleDelete(s)} deleteLabel="Remove" />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-400">No suppliers yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit supplier' : 'Add supplier'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave}>
            <div className="mb-3">
              <label className="label">Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="label">Contact</label>
              <input className="input" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Phone number" />
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
        <Modal title={`Mark as paid — ${payTarget.name}`} onClose={() => setPayTarget(null)}>
          <form onSubmit={handlePayment}>
            <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
              Outstanding balance: <span className="figure font-medium text-rust-500">LKR {payTarget.payableBalance.toFixed(2)}</span>
            </p>
            <label className="label">Amount paid</label>
            <input
              type="number" step="0.01" min="0.01" max={payTarget.payableBalance}
              className="input" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} required autoFocus
            />
            {payError && <p className="mt-2 text-sm text-rust-500">{payError}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setPayTarget(null)}>Cancel</button>
              <button type="submit" className="btn-primary">Confirm payment</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
