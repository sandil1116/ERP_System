import { useEffect, useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { productApi } from '../../api/productApi'
import { supplierApi } from '../../api/supplierApi'
import { purchaseApi } from '../../api/purchaseApi'

export default function NewPurchaseTab() {
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [cart, setCart] = useState([]) // [{productId, name, unitCost, quantity}]
  const [selectedProductId, setSelectedProductId] = useState('')
  const [supplierId, setSupplierId] = useState('')
  const [paymentType, setPaymentType] = useState('CASH')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    productApi.list().then(setProducts)
    supplierApi.list().then(setSuppliers)
  }, [])

  const addToCart = () => {
    const product = products.find((p) => p.id === selectedProductId)
    if (!product) return
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id)
      if (existing) return prev.map((i) => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { productId: product.id, name: product.name, unitCost: product.costPrice, quantity: 1 }]
    })
    setSelectedProductId('')
  }

  const updateCart = (productId, field, value) => {
    setCart((prev) => prev.map((i) => i.productId === productId ? { ...i, [field]: value } : i))
  }
  const removeItem = (productId) => setCart((prev) => prev.filter((i) => i.productId !== productId))

  const total = cart.reduce((sum, i) => sum + i.unitCost * i.quantity, 0)

  const handleSubmit = async () => {
    setError('')
    setSuccess('')
    if (!supplierId) { setError('Select a supplier.'); return }
    if (cart.length === 0) { setError('Add at least one item.'); return }

    setSubmitting(true)
    try {
      await purchaseApi.create({
        supplierId,
        paymentType,
        items: cart.map((i) => ({ productId: i.productId, quantity: i.quantity, unitCost: i.unitCost })),
      })
      setSuccess('Purchase recorded — stock updated.')
      setCart([])
      setSupplierId('')
      setPaymentType('CASH')
      productApi.list().then(setProducts)
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not record this purchase.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="card p-4 lg:col-span-2">
        <h2 className="mb-3 font-display text-base font-semibold text-slate-800 dark:text-slate-100">Items received</h2>
        <div className="mb-4 flex gap-2">
          <select className="input" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
            <option value="">Select a product…</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name} (current stock: {p.quantity})</option>)}
          </select>
          <button className="btn-secondary shrink-0" onClick={addToCart} disabled={!selectedProductId}>
            <Plus size={16} /> Add
          </button>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-500 dark:text-slate-400">
            <tr>
              <th className="pb-2 font-medium">Item</th>
              <th className="pb-2 text-right font-medium">Qty</th>
              <th className="pb-2 text-right font-medium">Unit cost</th>
              <th className="pb-2 text-right font-medium">Total</th>
              <th className="pb-2"></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.productId} className="border-t border-slate-100 dark:border-slate-800">
                <td className="py-2 text-slate-800 dark:text-slate-100">{item.name}</td>
                <td className="py-2 text-right">
                  <input type="number" min="1" className="input w-20 py-1 text-right"
                    value={item.quantity} onChange={(e) => updateCart(item.productId, 'quantity', Number(e.target.value))} />
                </td>
                <td className="py-2 text-right">
                  <input type="number" min="0" step="0.01" className="input w-24 py-1 text-right"
                    value={item.unitCost} onChange={(e) => updateCart(item.productId, 'unitCost', Number(e.target.value))} />
                </td>
                <td className="figure py-2 text-right text-slate-800 dark:text-slate-100">{(item.unitCost * item.quantity).toFixed(2)}</td>
                <td className="py-2 text-right">
                  <button className="icon-btn hover:!bg-rust-500/10 hover:!text-rust-500" onClick={() => removeItem(item.productId)}>
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {cart.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-sm text-slate-400">No items added yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="card h-fit p-4">
        <h2 className="mb-3 font-display text-base font-semibold text-slate-800 dark:text-slate-100">Purchase details</h2>

        <div className="mb-3">
          <label className="label">Supplier</label>
          <select className="input" value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
            <option value="">Select supplier…</option>
            {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="label">Payment</label>
          <div className="flex gap-2">
            {['CASH', 'CREDIT'].map((pt) => (
              <button key={pt} type="button" onClick={() => setPaymentType(pt)}
                className={`flex-1 rounded-card border px-3 py-2 text-sm font-medium transition-colors ${
                  paymentType === pt ? 'border-ledger-500 bg-ledger-500/10 text-ledger-700 dark:text-ledger-300' : 'border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400'
                }`}>
                {pt === 'CASH' ? 'Cash' : 'Credit'}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 flex justify-between border-t border-slate-200 pt-3 dark:border-slate-700">
          <span className="font-medium text-slate-700 dark:text-slate-200">Total</span>
          <span className="figure text-xl font-semibold text-slate-800 dark:text-slate-100">LKR {total.toFixed(2)}</span>
        </div>

        {error && <p className="mb-3 text-sm text-rust-500">{error}</p>}
        {success && <p className="mb-3 text-sm text-ledger-600 dark:text-ledger-300">{success}</p>}

        <button className="btn-primary w-full justify-center" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Recording…' : 'Record purchase'}
        </button>
      </div>
    </div>
  )
}
