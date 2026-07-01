import { useState } from 'react'
import { login as apiLogin, isAuthenticated } from '../api/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated()) {
    window.location.href = '#/'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await apiLogin(email, password)
      window.dispatchEvent(new Event('auth-change'))
      window.location.href = '#/'
    } catch (err: any) {
      setError(err?.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-indigo-600 mb-1">🤖 Mannobot</h1>
        <p className="text-sm text-gray-500 mb-6">Faça login para continuar</p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2"
              placeholder="voce@empresa.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 font-medium disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">ⓘ Ainda não tem conta? Cadastre um email e senha.</p>
        <p className="text-xs text-gray-500 mt-2 text-center">Registro via API: <code>/api/v1/auth/register</code></p>
      </form>
    </div>
  )
}
