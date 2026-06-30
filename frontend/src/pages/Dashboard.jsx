import { Calendar, DollarSign, Bell, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Calendar} label="Agendamentos Hoje" value="3" color="indigo" />
        <StatCard icon={DollarSign} label="Receita Mês" value="€2.450" color="green" />
        <StatCard icon={Bell} label="Lembretes Pendentes" value="5" color="amber" />
        <StatCard icon={TrendingUp} label="Taxa Conversão" value="78%" color="purple" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold mb-4">Ação Rápida</h2>
        <div className="flex gap-3 flex-wrap">
          <a href="/scheduler" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            + Novo Agendamento
          </a>
          <a href="/finance" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            + Registrar Transação
          </a>
          <a href="/reminders" className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition">
            + Criar Lembrete
          </a>
        </div>
      </div>

      {/* AI Insight */}
      <div className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="font-semibold mb-2">💡 Insight IA</h3>
        <p className="text-indigo-100">
          Suas despesas com alimentação aumentaram 25% este mês. Considere revisar seus fornecedores
          ou negociar descontos por volume.
        </p>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}
