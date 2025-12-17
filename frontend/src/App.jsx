"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import React, { useState } from "react"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Predictions from "./pages/Predictions"
import Profile from "./pages/Profile"
import About from "./pages/About"
import Layout from "./components/Layout"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [uploadedData, setUploadedData] = useState([])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  const handleDataUpload = (newData) => {
    setUploadedData(newData)
  }

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/about" element={<About />} />
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <Layout onLogout={handleLogout}>
              <Routes>
                <Route
                  path="/dashboard"
                  element={<Dashboard onDataUpload={handleDataUpload} uploadedData={uploadedData} />}
                />
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
