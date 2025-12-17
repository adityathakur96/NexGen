import { Card } from "../components/ui/card"
import { TrendingUp, Calendar, DollarSign } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const forecastData = [
  { month: "Jul", prediction: 72000, confidence: 68000 },
  { month: "Aug", prediction: 78000, confidence: 74000 },
  { month: "Sep", prediction: 82000, confidence: 78000 },
  { month: "Oct", prediction: 88000, confidence: 84000 },
  { month: "Nov", prediction: 95000, confidence: 91000 },
  { month: "Dec", prediction: 102000, confidence: 98000 },
]

export default function Predictions() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Sales Predictions</h2>
        <p className="text-slate-600 mt-1">AI-powered forecasting for the next 6 months</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Q3 2024</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">$232,000</h3>
          <p className="text-purple-100">Predicted Revenue</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Q4 2024</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">$285,000</h3>
          <p className="text-blue-100">Predicted Revenue</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Growth</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">+28.5%</h3>
          <p className="text-pink-100">Expected Increase</p>
        </Card>
      </div>

      <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4">6-Month Forecast</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={forecastData}>
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
            <Line
              type="monotone"
              dataKey="prediction"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: "#8b5cf6", r: 6 }}
              name="Prediction"
            />
            <Line
              type="monotone"
              dataKey="confidence"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "#3b82f6", r: 4 }}
              name="Confidence"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
