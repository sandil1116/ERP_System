import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { userApi } from '../../api/userApi'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/Modal'
import RowActions from '../../components/RowActions'

const ROLES = ['ADMIN', 'CASHIER', 'STAFF']
const ROLE_BADGE_CLASS = { ADMIN: 'badge-admin', CASHIER: 'badge-cashier', STAFF: 'badge-staff' }

const emptyForm = { name: '', email: '', password: '', role: 'STAFF', active: true }

export default function UserManagement() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null) // null = "add" mode
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const loadUsers = () => {
    setLoading(true)
    userApi
      .list()
      .then(setUsers)
      .catch(() => setError('Could not load users. Is the backend running?'))
      .finally(() => setLoading(false))
  }

  useEffect(loadUsers, [])

  const openAddModal = () => {
    setEditingUser(null)
    setForm(emptyForm)
    setFormError('')
    setModalOpen(true)
  }

  const openEditModal = (u) => {
    setEditingUser(u)
    setForm({ name: u.name, email: u.email, password: '', role: u.role, active: u.active })
    setFormError('')
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      if (editingUser) {
        const updated = await userApi.update(editingUser.id, {
          name: form.name,
          role: form.role,
          active: form.active,
          password: form.password || undefined,
        })
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
      } else {
        const created = await userApi.create(form)
        setUsers((prev) => [...prev, created])
      }
      setModalOpen(false)
    } catch (err) {
      setFormError(err?.response?.data?.error || 'Could not save this user.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async (u) => {
    if (u.id === currentUser.id) {
      alert("You can't deactivate your own account.")
      return
    }
    if (!confirm(`Deactivate ${u.name}? They won't be able to log in until reactivated.`)) return
    const updated = await userApi.deactivate(u.id)
    setUsers((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-800 dark:text-slate-100">Users</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create and manage Admin, Cashier, and Staff accounts for your team.
          </p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={16} /> Add user
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <p className="p-5 text-sm text-slate-500 dark:text-slate-400">Loading users…</p>
        ) : error ? (
          <p className="p-5 text-sm text-rust-500">{error}</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">
                    {u.name} {u.id === currentUser.id && <span className="text-xs text-slate-400">(you)</span>}
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={ROLE_BADGE_CLASS[u.role]}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={u.active ? 'badge bg-ledger-500/15 text-ledger-700 dark:text-ledger-300' : 'badge bg-rust-500/15 text-rust-500'}>
                      {u.active ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <RowActions onEdit={() => openEditModal(u)} onDelete={() => handleDeactivate(u)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title={editingUser ? 'Edit user' : 'Add user'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave}>
            <div className="mb-3">
              <label className="label">Name</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {!editingUser && (
              <div className="mb-3">
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="mb-3">
              <label className="label">{editingUser ? 'Reset password (optional)' : 'Password'}</label>
              <input
                type="password"
                className="input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={editingUser ? 'Leave blank to keep current password' : 'At least 6 characters'}
                required={!editingUser}
                minLength={6}
              />
            </div>

            <div className="mb-3">
              <label className="label">Role</label>
              <select
                className="input"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {editingUser && (
              <label className="mb-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />
                Account active
              </label>
            )}

            {formError && <p className="mb-3 text-sm text-rust-500">{formError}</p>}

            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
