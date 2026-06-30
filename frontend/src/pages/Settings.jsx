import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Clock, Bot, Globe, Save } from 'lucide-react'

export default function Settings() {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setForm(data)
    } catch (e) {
      setMessage('Falha ao carregar configurações.')
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setForm(data)
      setMessage('Configurações salvas com sucesso!')
      setTimeout(() => setMessage(''), 3000)
    } catch (e) {
      setMessage('Erro ao salvar configurações.')
    }
    setSaving(false)
  }

  if (!form) {
    return <p className="text-gray-500">Carregando...</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Business Hours */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} className="text-indigo-600" />
            <h2 className="font-semibold text-lg">Horário de Funcionamento</h2>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.business_hours_enabled}
                onChange={(e) =>
                  handleChange('business_hours_enabled', e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600" />
            </label>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Ativar horário comercial
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Início (hora)
              </label>
              <input
                type="number"
                min="0"
                max="23"
                value={form.business_hours_start}
                onChange={(e) =>
                  handleChange('business_hours_start', Number(e.target.value))
                }
                disabled={!form.business_hours_enabled}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Fim (hora)
              </label>
              <input
                type="number"
                min="0"
                max="23"
                value={form.business_hours_end}
                onChange={(e) =>
                  handleChange('business_hours_end', Number(e.target.value))
                }
                disabled={!form.business_hours_enabled}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Fuso Horário
              </label>
              <select
                value={form.business_hours_timezone}
                onChange={(e) =>
                  handleChange('business_hours_timezone', e.target.value)
                }
                disabled={!form.business_hours_enabled}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
              >
                <option value="Europe/Lisbon">Europe/Lisbon</option>
                <option value="America/Sao_Paulo">America/Sao_Paulo</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </section>

        {/* AI Prompt */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Bot size={20} className="text-indigo-600" />
            <h2 className="font-semibold text-lg">Prompt do Assistente</h2>
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Instruções padrão que moldam a personalidade e comportamento do Mannobot.
          </p>
          <textarea
            rows={6}
            value={form.ai_system_prompt}
            onChange={(e) => handleChange('ai_system_prompt', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
          />
        </section>

        {/* Models */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={20} className="text-indigo-600" />
            <h2 className="font-semibold text-lg">Modelos de IA</h2>
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Lista de modelos em ordem de fallback (um por linha).
          </p>
          <textarea
            rows={4}
            value={(form.openrouter_models || []).join('\n')}
            onChange={(e) =>
              handleChange(
                'openrouter_models',
                e.target.value
                  .split('\n')
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
          />
        </section>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={18} />
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          {message && (
            <span
              className={`text-sm ${
                message.includes('sucesso')
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {message}
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
