import { useState } from "react"
import { Card } from "../components/ui/card"
import { TrendingUp, Calendar, DollarSign, Activity, Package } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { predictSales, predictStock } from "../lib/api"

const forecastData = [
  { month: "Jul", prediction: 72000, confidence: 68000 },
  { month: "Aug", prediction: 78000, confidence: 74000 },
  { month: "Sep", prediction: 82000, confidence: 78000 },
  { month: "Oct", prediction: 88000, confidence: 84000 },
  { month: "Nov", prediction: 95000, confidence: 91000 },
  { month: "Dec", prediction: 102000, confidence: 98000 },
]

export default function Predictions() {
  const [salesInputs, setSalesInputs] = useState({
    unit_price: 0,
    is_promotion: 0,
    customer_income: 0,
    competitor_price: 0,
    marketing_spend: 0
  })

  const [stockInputs, setStockInputs] = useState({
    lead_time: 0,
    stock_level: 0,
    supplier_delay: 0,
    shelf_life: 0
  })

  const [salesResult, setSalesResult] = useState(null)
  const [stockResult, setStockResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSalesPredict = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = await predictSales(salesInputs)
      setSalesResult(result.prediction)
    } catch (err) {
      setError("Failed to predict sales. Ensure inputs are valid.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStockPredict = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await predictStock(stockInputs)
      setStockResult(result.prediction)
    } catch (err) {
      setError("Failed to predict stock replenishment.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Model Predictions</h2>
        <p className="text-slate-600 mt-1">Real-time forecasting using NexGen ML models</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Prediction Card */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Sales Forecaster</h3>
          </div>

          <form onSubmit={handleSalesPredict} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Unit Price</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={salesInputs.unit_price}
                  onChange={(e) => setSalesInputs({ ...salesInputs, unit_price: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Input Promotion (0/1)</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={salesInputs.is_promotion}
                  onChange={(e) => setSalesInputs({ ...salesInputs, is_promotion: parseInt(e.target.value) })}
                >
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Customer Income</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={salesInputs.customer_income}
                  onChange={(e) => setSalesInputs({ ...salesInputs, customer_income: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Marketing Spend</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={salesInputs.marketing_spend}
                  onChange={(e) => setSalesInputs({ ...salesInputs, marketing_spend: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Predicting..." : "Predict Sales Revenue"}
            </button>
          </form>

          {salesResult !== null && (
            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100 text-center animate-fade-in">
              <p className="text-sm text-purple-600 font-medium">Predicted Sales</p>
              <p className="text-3xl font-bold text-purple-800">${salesResult.toFixed(2)}</p>
            </div>
          )}
        </Card>

        {/* Stock Prediction Card */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Stock Reorder Optimizer</h3>
          </div>

          <form onSubmit={handleStockPredict} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Current Stock</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={stockInputs.stock_level}
                  onChange={(e) => setStockInputs({ ...stockInputs, stock_level: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Lead Time (days)</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={stockInputs.lead_time}
                  onChange={(e) => setStockInputs({ ...stockInputs, lead_time: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Supplier Delay</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={stockInputs.supplier_delay}
                  onChange={(e) => setStockInputs({ ...stockInputs, supplier_delay: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase">Shelf Life</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={stockInputs.shelf_life}
                  onChange={(e) => setStockInputs({ ...stockInputs, shelf_life: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Calculating..." : "Predict Reorder Quantity"}
            </button>
          </form>

          {stockResult !== null && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 text-center animate-fade-in">
              <p className="text-sm text-blue-600 font-medium">Recommended Reorder</p>
              <p className="text-3xl font-bold text-blue-800">{Math.round(stockResult)} Units</p>
            </div>
          )}
        </Card>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* Static Forecast Chart (existing) */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-slate-200 mt-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4">6-Month Trend Forecast</h3>
        <ResponsiveContainer width="100%" height={300}>
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
