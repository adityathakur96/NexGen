import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

export default function Layout({ children, onLogout }) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Sidebar onLogout={onLogout} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
