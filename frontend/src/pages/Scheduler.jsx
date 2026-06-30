import { useState } from 'react'
import { Send, Calendar, Clock, User } from 'lucide-react'

export default function Scheduler() {
  const [input, setInput] = useState('')
  const [parsed, setParsed] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleParse = async () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/scheduler/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      })
      const data = await res.json()
      setParsed(data)
    } catch (e) {
      setParsed({ title: input, confidence: 0.5, error: true })
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Agenda Inteligente</h1>

      {/* NLP Input */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="font-semibold mb-3">Agendar com linguagem natural</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Ex: "marcar corte de cabelo com João sexta às 15h"'
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleParse()}
          />
          <button
            onClick={handleParse}
            disabled={loading}
            className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Send size={18} />
            {loading ? 'Processando...' : 'Agendar'}
          </button>
        </div>

        {/* Parsed Result */}
        {parsed && (
          <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <h3 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Resultado:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-indigo-500" />
                <span>{parsed.title}</span>
              </div>
              {parsed.customer_name && (
                <div className="flex items-center gap-2">
                  <User size={16} className="text-indigo-500" />
                  <span>{parsed.customer_name}</span>
                </div>
              )}
              {parsed.appointment_time && (
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-indigo-500" />
                  <span>{new Date(parsed.appointment_time).toLocaleString('pt-PT')}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Confiança: {Math.round(parsed.confidence * 100)}%</p>
          </div>
        )}
      </div>

      {/* Calendar Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold mb-4">Próximos Compromissos</h2>
        <div className="text-center py-12 text-gray-400">
          <Calendar size={48} className="mx-auto mb-3 opacity-50" />
          <p>Nenhum agendamento ainda.</p>
          <p className="text-sm">Use o campo acima para criar seu primeiro agendamento.</p>
        </div>
      </div>
    </div>
  )
}
