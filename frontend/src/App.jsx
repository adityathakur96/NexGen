"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import React, { useState, useEffect } from "react"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/ForgotPassword"
import Dashboard from "./pages/Dashboard"
import Predictions from "./pages/Predictions"
import Profile from "./pages/Profile"
import About from "./pages/About"
import Layout from "./components/Layout"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"))

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
  }

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/about" element={<About />} />
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <Layout onLogout={handleLogout}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/predictions" element={<Predictions />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  )
}

export default App
