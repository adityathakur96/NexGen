export default function StatCard({ title, value, change, icon: Icon, color }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div className={`bg-linear-to-br ${color} p-3 rounded-xl shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
          {change}
        </span>
      </div>
      <h3 className="text-slate-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  )
}
