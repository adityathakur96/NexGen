"use client"

import { useNavigate } from "react-router-dom"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { BarChart3, TrendingUp, Users, Shield, ArrowLeft } from "lucide-react"

export default function About() {
  const navigate = useNavigate()

  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive sales data analysis with real-time insights and visualizations.",
    },
    {
      icon: TrendingUp,
      title: "AI-Powered Forecasting",
      description: "Predict future sales trends with machine learning algorithms.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together seamlessly with your sales team in one platform.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and security for your sensitive data.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <Button
          onClick={() => navigate("/login")}
          variant="outline"
          className="mb-4 border-slate-300 hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>

        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-5 rounded-2xl shadow-lg">
              <BarChart3 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            About NexGen
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            The next generation of sales analytics and forecasting platform, powered by AI and designed for modern
            businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-slate-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-3 rounded-xl shadow-lg flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-lg border-slate-200 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Ready to transform your sales process?</h2>
          <p className="text-slate-600 mb-6">Join thousands of businesses using NexGen to drive growth.</p>
          <Button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started Today
          </Button>
        </Card>
      </div>
    </div>
  )
}
