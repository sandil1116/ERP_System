import { useState } from 'react'
import TabBar from '../../components/TabBar'
import EmployeesTab from './EmployeesTab'
import PayrollRunTab from './PayrollRunTab'

const TABS = [
  { key: 'employees', label: 'Employees' },
  { key: 'payroll', label: 'Payroll Run' },
]

export default function Employees() {
  const [tab, setTab] = useState('employees')

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-800 dark:text-slate-100">Employees & Payroll</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Manage your team, track loans/advances, and run payroll with automatic deductions.
      </p>

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'employees' && <EmployeesTab />}
      {tab === 'payroll' && <PayrollRunTab />}
    </div>
  )
}
