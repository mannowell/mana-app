import { useState, useEffect } from 'react'
import { MessageSquare, Phone, Search, Send, ArrowLeft } from 'lucide-react'

export default function Conversations() {
  const [conversations, setConversations] = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [msgLoading, setMsgLoading] = useState(false)
  const [search, setSearch] = useState('')

  const fetchConversations = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/conversations')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setConversations(data)
    } catch (e) {
      setConversations([])
    }
    setLoading(false)
  }

  const fetchMessages = async (conversationId) => {
    setMsgLoading(true)
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages?limit=200`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setMessages(data)
    } catch (e) {
      setMessages([])
    }
    setMsgLoading(false)
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selected) {
      fetchMessages(selected.id)
    }
  }, [selected])

  const filtered = conversations.filter((c) =>
    c.phone_number.includes(search),
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Conversas</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[calc(100vh-10rem)]">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por telefone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="p-4 text-center text-gray-500 text-sm">Carregando...</p>
            ) : filtered.length === 0 ? (
              <p className="p-4 text-center text-gray-500 text-sm">Nenhuma conversa.</p>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                    selected?.id === c.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/20'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        c.is_active ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                    <Phone size={16} className="text-gray-500" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{c.phone_number}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {c.last_message_at
                          ? new Date(c.last_message_at).toLocaleString('pt-PT')
                          : 'Sem mensagens'}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">{c.message_count}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[calc(100vh-10rem)]">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageSquare size={48} className="mb-3 opacity-50" />
              <p>Selecione uma conversa para ver as mensagens.</p>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <button
                  onClick={() => setSelected(null)}
                  className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <p className="font-semibold">{selected.phone_number}</p>
                  <p className="text-xs text-gray-500">
                    {selected.is_active ? 'Ativa' : 'Inativa'} •{' '}
                    {selected.message_count || 0} mensagens
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {msgLoading ? (
                  <p className="text-center text-gray-500 text-sm">
                    Carregando mensagens...
                  </p>
                ) : messages.length === 0 ? (
                  <p className="text-center text-gray-500 text-sm">
                    Nenhuma mensagem.
                  </p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.direction === 'inbound' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          m.direction === 'inbound'
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                            : 'bg-indigo-600 text-white'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {m.content}
                        </p>
                        <p
                          className={`text-[10px] mt-1 ${
                            m.direction === 'inbound'
                              ? 'text-gray-500 dark:text-gray-400'
                              : 'text-indigo-200'
                          }`}
                        >
                          {new Date(m.created_at).toLocaleString('pt-PT')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
