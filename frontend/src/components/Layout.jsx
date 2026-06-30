import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Calendar, DollarSign, Bell, LayoutDashboard, Menu, X, MessageSquare, Settings, LogOut, LogIn, UserPlus } from 'lucide-react'
import { isAuthenticated, logout as apiLogout } from '../api/client'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/conversations', label: 'Conversas', icon: MessageSquare },
  { path: '/scheduler', label: 'Agenda', icon: Calendar },
  { path: '/finance', label: 'Finanças', icon: DollarSign },
  { path: '/reminders', label: 'Lembretes', icon: Bell },
  { path: '/settings', label: 'Configurações', icon: Settings },
]

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    setAuthed(isAuthenticated())
    const handler = () => setAuthed(isAuthenticated())
    window.addEventListener('storage', handler)
    window.addEventListener('auth-change', handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('auth-change', handler)
    }
  }, [])

  const handleLogout = () => {
    apiLogout()
    setAuthed(false)
    navigate('/login')
    window.dispatchEvent(new Event('auth-change'))
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform lg:static lg:inset-auto`}>
        <div className="p-6">
          <p className="text-xs text-gray-500">{authed ? '👋 Logado' : '🔒 Não autenticado'}</p>
        </div>
        <nav className="px-3">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                location.pathname === path
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
          <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
            {authed ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
              >
                <LogOut size={20} />
                <span className="font-medium">Sair</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                onClick={() => setSidebarOpen(false)}
              >
                <LogIn size={20} />
                <span className="font-medium">Entrar</span>
              </Link>
            )}
          </div>
        </nav>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="font-bold text-indigo-600">🤖 Mannobot</h1>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8 mt-14 lg:mt-0">
        {children}
      </main>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
