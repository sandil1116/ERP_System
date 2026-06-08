import { useState } from 'react'
import TabBar from '../../components/TabBar'
import NewSaleTab from './NewSaleTab'
import SalesHistoryTab from './SalesHistoryTab'
import CustomersTab from './CustomersTab'

const TABS = [
  { key: 'new', label: 'New Sale' },
  { key: 'history', label: 'Sales History' },
  { key: 'customers', label: 'Customers' },
]

export default function Sales() {
  const [tab, setTab] = useState('new')

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-800 dark:text-slate-100">Sales & Customers</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Process sales, track credit, and manage your customer list.
      </p>

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'new' && <NewSaleTab />}
      {tab === 'history' && <SalesHistoryTab />}
      {tab === 'customers' && <CustomersTab />}
    </div>
  )
}
