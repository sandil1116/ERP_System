import { useEffect, useState } from 'react'
import { Plus, Landmark } from 'lucide-react'
import { employeeApi } from '../../api/employeeApi'
import Modal from '../../components/Modal'
import RowActions from '../../components/RowActions'
import EmployeeLoansModal from './EmployeeLoansModal'

const emptyForm = { name: '', jobTitle: '', contact: '', baseSalary: '', active: true }

export default function EmployeesTab() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [loansTarget, setLoansTarget] = useState(null)

  const load = () => {
    setLoading(true)
    employeeApi.list().then(setEmployees).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setFormError(''); setModalOpen(true) }
  const openEdit = (e) => {
    setEditing(e)
    setForm({ name: e.name, jobTitle: e.jobTitle || '', contact: e.contact || '', baseSalary: e.baseSalary, active: e.active })
    setFormError('')
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    const payload = { ...form, baseSalary: Number(form.baseSalary) }
    try {
      if (editing) {
        const updated = await employeeApi.update(editing.id, payload)
        setEmployees((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
      } else {
        const created = await employeeApi.create(payload)
        setEmployees((prev) => [...prev, created])
      }
      setModalOpen(false)
    } catch (err) {
      setFormError(err?.response?.data?.error || 'Could not save this employee.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (e) => {
    if (!confirm(`Remove ${e.name}?`)) return
    await employeeApi.remove(e.id)
    setEmployees((prev) => prev.filter((x) => x.id !== e.id))
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">Your team's records and base salary.</p>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add employee</button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <p className="p-5 text-sm text-slate-500 dark:text-slate-400">Loading…</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium text-right">Base salary</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">{e.name}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{e.jobTitle || '—'}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{e.contact || '—'}</td>
                  <td className="figure px-5 py-3 text-right text-slate-800 dark:text-slate-100">{e.baseSalary.toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <span className={e.active ? 'badge bg-ledger-500/15 text-ledger-700 dark:text-ledger-300' : 'badge bg-rust-500/15 text-rust-500'}>
                      {e.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button className="icon-btn" title="Loans & advances" onClick={() => setLoansTarget(e)}>
                        <Landmark size={16} />
                      </button>
                      <RowActions onEdit={() => openEdit(e)} onDelete={() => handleDelete(e)} deleteLabel="Remove" />
                    </div>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-400">No employees yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit employee' : 'Add employee'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave}>
            <div className="mb-3">
              <label className="label">Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="label">Job title</label>
              <input className="input" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} placeholder="e.g. Sales Assistant" />
            </div>
            <div className="mb-3">
              <label className="label">Contact</label>
              <input className="input" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Phone number" />
            </div>
            <div className="mb-3">
              <label className="label">Base salary</label>
              <input type="number" step="0.01" min="0" className="input" value={form.baseSalary} onChange={(e) => setForm({ ...form, baseSalary: e.target.value })} required />
            </div>
            {editing && (
              <label className="mb-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                Active (included in payroll runs)
              </label>
            )}
            {formError && <p className="mb-3 text-sm text-rust-500">{formError}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}

      {loansTarget && <EmployeeLoansModal employee={loansTarget} onClose={() => setLoansTarget(null)} />}
    </div>
  )
}
