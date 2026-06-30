import { useState } from 'react'
import { Bell, Plus, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function Reminders() {
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [channel, setChannel] = useState('whatsapp')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lembretes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2"
        >
          <Plus size={18} />
          Novo Lembrete
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="font-semibold mb-4">Criar Lembrete</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Mensagem</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ex: Olá! Seu agendamento é amanhã às 15h."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Canal</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Agendar para</label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
          </div>
          <button className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Criar Lembrete
          </button>
        </div>
      )}

      {/* Reminders List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold mb-4">Lembretes Agendados</h2>
        <div className="text-center py-12 text-gray-400">
          <Bell size={48} className="mx-auto mb-3 opacity-50" />
          <p>Nenhum lembrete agendado.</p>
          <p className="text-sm">Crie seu primeiro lembrete acima.</p>
        </div>
      </div>
    </div>
  )
}
