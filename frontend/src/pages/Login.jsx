"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, BarChart3 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

export default function Login({ onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin()
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-100 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-purple-100">
          <div className="flex justify-center mb-6">
            <div className="bg-linear-to-br from-purple-500 to-blue-500 p-4 rounded-2xl shadow-lg animate-pulse-glow">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Welcome to NexGen
            </h1>
            <p className="text-slate-600">Sales Analytics & Forecasting Platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-slate-50 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/about")}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              Learn more about NexGen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
