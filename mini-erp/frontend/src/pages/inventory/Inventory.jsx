import { useEffect, useState } from 'react'
import { Plus, AlertTriangle } from 'lucide-react'
import { productApi } from '../../api/productApi'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/Modal'
import RowActions from '../../components/RowActions'

const emptyForm = { name: '', category: '', unit: 'pcs', costPrice: '', salePrice: '', quantity: '', reorderLevel: '' }

export default function Inventory() {
  const { hasRole } = useAuth()
  const canEdit = hasRole('ADMIN', 'STAFF')

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const [search, setSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const load = () => {
    setLoading(true)
    productApi.list().then(setProducts).catch(() => setError('Could not load products.')).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const filtered = products
    .filter((p) => !lowStockOnly || p.lowStock)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({
      name: p.name, category: p.category || '', unit: p.unit || 'pcs',
      costPrice: p.costPrice, salePrice: p.salePrice, quantity: p.quantity, reorderLevel: p.reorderLevel,
    })
    setFormError('')
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    const payload = {
      name: form.name,
      category: form.category,
      unit: form.unit,
      costPrice: Number(form.costPrice),
      salePrice: Number(form.salePrice),
      quantity: Number(form.quantity),
      reorderLevel: Number(form.reorderLevel),
    }
    try {
      if (editing) {
        const updated = await productApi.update(editing.id, payload)
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      } else {
        const created = await productApi.create(payload)
        setProducts((prev) => [...prev, created])
      }
      setModalOpen(false)
    } catch (err) {
      setFormError(err?.response?.data?.error || 'Could not save this product.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (p) => {
    if (!confirm(`Remove ${p.name} from inventory?`)) return
    await productApi.remove(p.id)
    setProducts((prev) => prev.filter((x) => x.id !== p.id))
  }

  const lowStockCount = products.filter((p) => p.lowStock).length

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-800 dark:text-slate-100">Inventory</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Live stock levels. {lowStockCount > 0 && (
              <span className="text-rust-500">{lowStockCount} item{lowStockCount > 1 ? 's' : ''} need restocking.</span>
            )}
          </p>
        </div>
        {canEdit && (
          <button className="btn-primary" onClick={openAdd}>
            <Plus size={16} /> Add product
          </button>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          className="input max-w-xs"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input type="checkbox" checked={lowStockOnly} onChange={(e) => setLowStockOnly(e.target.checked)} />
          Low stock only
        </label>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <p className="p-5 text-sm text-slate-500 dark:text-slate-400">Loading…</p>
        ) : error ? (
          <p className="p-5 text-sm text-rust-500">{error}</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium text-right">Cost</th>
                <th className="px-5 py-3 font-medium text-right">Price</th>
                <th className="px-5 py-3 font-medium text-right">Stock</th>
                {canEdit && <th className="px-5 py-3 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">{p.name}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{p.category || '—'}</td>
                  <td className="figure px-5 py-3 text-right text-slate-600 dark:text-slate-300">{p.costPrice.toFixed(2)}</td>
                  <td className="figure px-5 py-3 text-right text-slate-600 dark:text-slate-300">{p.salePrice.toFixed(2)}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`figure inline-flex items-center gap-1 ${p.lowStock ? 'text-rust-500 font-medium' : 'text-slate-700 dark:text-slate-200'}`}>
                      {p.lowStock && <AlertTriangle size={13} />}
                      {p.quantity} {p.unit}
                    </span>
                  </td>
                  {canEdit && (
                    <td className="px-5 py-3">
                      <RowActions onEdit={() => openEdit(p)} onDelete={() => handleDelete(p)} deleteLabel="Remove" />
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-400">No products found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit product' : 'Add product'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave}>
            <div className="mb-3">
              <label className="label">Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="mb-3 grid grid-cols-2 gap-3">
              <div>
                <label className="label">Category</label>
                <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div>
                <label className="label">Unit</label>
                <input className="input" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="pcs, kg, box…" />
              </div>
            </div>
            <div className="mb-3 grid grid-cols-2 gap-3">
              <div>
                <label className="label">Cost price</label>
                <input type="number" step="0.01" min="0" className="input" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} required />
              </div>
              <div>
                <label className="label">Sale price</label>
                <input type="number" step="0.01" min="0" className="input" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} required />
              </div>
            </div>
            <div className="mb-3 grid grid-cols-2 gap-3">
              <div>
                <label className="label">{editing ? 'Stock (manual correction)' : 'Opening stock'}</label>
                <input type="number" min="0" className="input" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
              </div>
              <div>
                <label className="label">Reorder level</label>
                <input type="number" min="0" className="input" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} required />
              </div>
            </div>
            {editing && (
              <p className="mb-3 text-xs text-slate-400">
                Normally stock only changes via Sales/Purchases. Only edit this field directly to correct a stocktake error.
              </p>
            )}
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
