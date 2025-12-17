import { Bell, Search } from "lucide-react"

export default function Navbar() {
  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-6">
          <button className="relative p-2.5 rounded-lg hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
              JD
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">John Doe</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
