import { useState } from 'react'
import TabBar from '../../components/TabBar'
import ProfitLossTab from './ProfitLossTab'
import CashFlowTab from './CashFlowTab'
import AccountBalancesTab from './AccountBalancesTab'
import LedgerTab from './LedgerTab'
import ExpensesTab from './ExpensesTab'

const TABS = [
  { key: 'pl', label: 'Profit & Loss' },
  { key: 'cashflow', label: 'Cash Flow' },
  { key: 'accounts', label: 'Account Balances' },
  { key: 'expenses', label: 'Expenses' },
  { key: 'ledger', label: 'Ledger' },
]

export default function Financials() {
  const [tab, setTab] = useState('pl')

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-800 dark:text-slate-100">Financials</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Built entirely from the ledger entries Sales, Purchases, and Expenses already write — nothing here is
        entered by hand.
      </p>

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'pl' && <ProfitLossTab />}
      {tab === 'cashflow' && <CashFlowTab />}
      {tab === 'accounts' && <AccountBalancesTab />}
      {tab === 'expenses' && <ExpensesTab />}
      {tab === 'ledger' && <LedgerTab />}
    </div>
  )
}
