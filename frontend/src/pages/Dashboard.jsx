"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, Users, Target, Upload, FileText } from "lucide-react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import StatCard from "../components/ui/StatCard"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const defaultSalesData = [
  { month: "Jan", sales: 45000, forecast: 48000 },
  { month: "Feb", sales: 52000, forecast: 54000 },
  { month: "Mar", sales: 48000, forecast: 51000 },
  { month: "Apr", sales: 61000, forecast: 63000 },
  { month: "May", sales: 55000, forecast: 58000 },
  { month: "Jun", sales: 67000, forecast: 69000 },
]

export default function Dashboard({ onDataUpload, uploadedData }) {
  const [salesData, setSalesData] = useState(uploadedData.length > 0 ? uploadedData : defaultSalesData)
  const [fileName, setFileName] = useState("")

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const csvData = event.target?.result
          const lines = csvData.split("\n")
          const newData = []

          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim()
            if (line) {
              const [month, sales, forecast] = line.split(",")
              newData.push({
                month: month?.trim(),
                sales: Number.parseFloat(sales),
                forecast: Number.parseFloat(forecast),
              })
            }
          }

          if (newData.length > 0) {
            setSalesData(newData)
            onDataUpload(newData)
          }
        } catch (error) {
          console.error("Error parsing CSV:", error)
        }
      }
      reader.readAsText(file)
    }
  }

  const stats = [
    {
      title: "Total Revenue",
      value: "$324,500",
      change: "+12.5%",
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
    },
    { title: "Growth Rate", value: "23.8%", change: "+4.3%", icon: TrendingUp, color: "from-blue-500 to-blue-600" },
    { title: "Active Customers", value: "1,429", change: "+8.2%", icon: Users, color: "from-pink-500 to-pink-600" },
    { title: "Target Progress", value: "87%", change: "+15%", icon: Target, color: "from-indigo-500 to-indigo-600" },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-slate-600 mt-1">Overview of your sales performance</p>
        </div>

        <div className="flex items-center gap-3">
          <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="file-upload" />
          <label htmlFor="file-upload">
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                Upload Data
              </span>
            </Button>
          </label>
          {fileName && (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">{fileName}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-slate-200 hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Sales vs Forecast</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: "#8b5cf6", r: 5 }} />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#3b82f6"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: "#3b82f6", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-slate-200 hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="sales" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
