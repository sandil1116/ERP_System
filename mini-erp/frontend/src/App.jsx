import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Settings from './pages/settings/Settings'
import UserManagement from './pages/settings/UserManagement'
import Sales from './pages/sales/Sales'
import Purchases from './pages/purchases/Purchases'
import Inventory from './pages/inventory/Inventory'
import Financials from './pages/financials/Financials'
import Employees from './pages/employees/Employees'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/settings" element={<Settings />} />

          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'CASHIER']} />}>
            <Route path="/sales" element={<Sales />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']} />}>
            <Route path="/purchases" element={<Purchases />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/settings/users" element={<UserManagement />} />
            <Route path="/financials" element={<Financials />} />
            <Route path="/employees" element={<Employees />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
