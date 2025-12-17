"use client"

import { NavLink } from "react-router-dom"
import { LayoutDashboard, TrendingUp, User, LogOut, BarChart3 } from "lucide-react"

export default function Sidebar({ onLogout }) {
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Predictions", path: "/predictions", icon: TrendingUp },
    { name: "Profile", path: "/profile", icon: User },
  ]

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col shadow-2xl border-r border-slate-700">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-2.5 rounded-xl shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              NexGen
            </h1>
            <p className="text-xs text-slate-400">Sales Analytics</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
