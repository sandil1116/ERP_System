import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api/authApi'

export default function Login() {
  const { login, bootstrap } = useAuth()
  const navigate = useNavigate()

  const [checkingSetup, setCheckingSetup] = useState(true)
  const [isFirstRun, setIsFirstRun] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    authApi
      .needsBootstrap()
      .then(setIsFirstRun)
      .catch(() => setIsFirstRun(false))
      .finally(() => setCheckingSetup(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isFirstRun) {
        await bootstrap(name, email, password)
      } else {
        await login(email, password)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-light px-4 dark:bg-paper-dark">
      <div className="w-full max-w-sm">
        {/* Receipt-style header stub - the visual signature carried through
            the login card, echoing a printed till receipt. */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-card bg-ledger-500 font-display text-lg font-bold text-white">
            M
          </div>
          <h1 className="font-display text-xl font-semibold text-slate-800 dark:text-slate-100">Mini ERP</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {checkingSetup ? 'Loading…' : isFirstRun ? 'Set up your Admin account to get started' : 'Sign in to your account'}
          </p>
        </div>

        {!checkingSetup && (
          <form onSubmit={handleSubmit} className="card border-dashed p-6">
            {isFirstRun && (
              <div className="mb-4">
                <label className="label" htmlFor="name">Business owner / your name</label>
                <input
                  id="name"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kasun Perera"
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@business.com"
                required
              />
            </div>

            <div className="mb-2">
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isFirstRun ? 'At least 6 characters' : '••••••••'}
                required
                minLength={isFirstRun ? 6 : undefined}
              />
            </div>

            {error && <p className="mt-3 text-sm text-rust-500">{error}</p>}

            <button type="submit" disabled={submitting} className="btn-primary mt-5 w-full justify-center">
              {submitting ? 'Please wait…' : isFirstRun ? 'Create Admin account' : 'Sign in'}
            </button>

            {isFirstRun && (
              <p className="mt-3 text-center text-xs text-slate-400">
                This account will have full Admin access. You can add Cashier and Staff accounts afterward from Settings.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
