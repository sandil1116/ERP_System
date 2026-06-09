import { useState } from 'react'
import TabBar from '../../components/TabBar'
import { useAuth } from '../../context/AuthContext'
import NewPurchaseTab from './NewPurchaseTab'
import PurchaseHistoryTab from './PurchaseHistoryTab'
import SuppliersTab from './SuppliersTab'

export default function Purchases() {
  const { hasRole } = useAuth()
  // Only Admin records new purchases; Staff can view history + suppliers (see role matrix).
  const tabs = [
    ...(hasRole('ADMIN') ? [{ key: 'new', label: 'New Purchase' }] : []),
    { key: 'history', label: 'Purchase History' },
    { key: 'suppliers', label: 'Suppliers' },
  ]
  const [tab, setTab] = useState(tabs[0].key)

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-800 dark:text-slate-100">Purchases & Suppliers</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Record incoming stock and track what you owe suppliers.
      </p>

      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'new' && hasRole('ADMIN') && <NewPurchaseTab />}
      {tab === 'history' && <PurchaseHistoryTab />}
      {tab === 'suppliers' && <SuppliersTab />}
    </div>
  )
}
