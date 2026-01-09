"use client"

import { useState, useEffect } from "react"
import { DollarSign, TrendingUp, Users, Target, BarChart3, Upload, Filter, AlertCircle, CheckCircle2 } from "lucide-react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import StatCard from "../components/ui/StatCard"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { fetchComprehensiveData, uploadCSV } from "../lib/api"

const COLORS = ["#8b5cf6", "#3b82f6", "#ec4899", "#10b981", "#f59e0b", "#ef4444"]

export default function Dashboard() {
  const [salesData, setSalesData] = useState([])
  const [stats, setStats] = useState(null)
  const [topProducts, setTopProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // New features state
  const [productLimit, setProductLimit] = useState(5)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState({ type: null, message: "" })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await fetchComprehensiveData()

      if (data) {
        if (data.sales_data) setSalesData(data.sales_data)
        if (data.stats) setStats(data.stats)
        if (data.top_products) setTopProducts(data.top_products)
        if (data.categories) setCategories(data.categories)
        if (data.locations) setLocations(data.locations)
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploading(true)
    setUploadStatus({ type: null, message: "" })

    try {
      await uploadCSV(file)
      setUploadStatus({ type: "success", message: "Data uploaded successfully! It will be processed soon." })
      setTimeout(() => setUploadStatus({ type: null, message: "" }), 5000)
    } catch (err) {
      setUploadStatus({ type: "error", message: err.message || "Failed to upload file" })
    } finally {
      setUploading(false)
      // Reset input
      event.target.value = ""
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-slate-200 shadow-xl rounded-lg">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <p key={index} style={{ color: entry.stroke || entry.fill }} className="text-sm font-medium">
                {entry.name}: {typeof entry.value === 'number' ? `$${entry.value.toLocaleString()}` : entry.value}
              </p>
            ))}
            {payload[0]?.payload?.sales_2024 !== undefined && (
              <div className="pt-2 mt-2 border-t border-slate-100 italic text-[10px] text-slate-500">
                <p>2024: ${payload[0].payload.sales_2024.toLocaleString()}</p>
                <p>2025: ${payload[0].payload.sales_2025.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const statsArray = stats
    ? [
      {
        title: "Total Revenue",
        value: stats.total_revenue || "$0",
        change: stats.revenue_change || "+0%",
        icon: DollarSign,
        color: "from-purple-500 to-purple-600",
      },
      {
        title: "Growth Rate",
        value: stats.growth_rate || "0%",
        change: stats.growth_change || "+0%",
        icon: TrendingUp,
        color: "from-blue-500 to-blue-600",
      },
      {
        title: "Active Customers",
        value: stats.active_customers || "0",
        change: stats.customers_change || "+0%",
        icon: Users,
        color: "from-pink-500 to-pink-600",
      },
      {
        title: "Target Progress",
        value: stats.target_progress || "0%",
        change: stats.target_change || "+0%",
        icon: Target,
        color: "from-indigo-500 to-indigo-600",
      },
    ]
    : []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading dashboard data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading dashboard data</p>
          <p className="text-sm mt-1">{error}</p>
          <Button onClick={fetchDashboardData} className="mt-3">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-slate-600 mt-1">Real-time sales performance overview</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative">
            <input
              type="file"
              id="csv-upload"
              className="hidden"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <Button
              asChild
              variant="outline"
              className="border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-700 font-medium"
            >
              <label htmlFor="csv-upload" className="cursor-pointer flex items-center gap-2">
                {uploading ? "Uploading..." : "Upload CSV"}
                <Upload className="w-4 h-4" />
              </label>
            </Button>
          </div>

          <Button
            onClick={fetchDashboardData}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {uploadStatus.type && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${uploadStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
          {uploadStatus.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-medium">{uploadStatus.message}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsArray.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Sales Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Sales vs Forecast</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="sales" name="Total Sales" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-800">Product Performance</h3>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={productLimit}
                onChange={(e) => setProductLimit(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium px-2 py-1 outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <option value={5}>Top 5</option>
                <option value={10}>Top 10</option>
                <option value={20}>All Products</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts.slice(0, productLimit)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" hide />
              <YAxis dataKey="product_name" type="category" stroke="#64748b" width={100} />
              <Tooltip />
              <Bar dataKey="total_revenue" name="Revenue" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Categories and Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="total_revenue"
                nameKey="category"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Regional Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locations.slice(0, 6)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="location" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="total_revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
