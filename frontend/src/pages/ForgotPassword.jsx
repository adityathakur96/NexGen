"use client"

import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Mail, Lock, BarChart3, ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { resetPassword } from "../lib/api"

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setMessage("")
        try {
            await resetPassword(email, newPassword)
            setMessage("Password has been reset successfully. You can now login.")
            setTimeout(() => navigate("/login"), 3000)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
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
                            Reset Password
                        </h1>
                        <p className="text-slate-600">Enter your email and new password</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm text-center">
                            {message}
                        </div>
                    )}

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
                                    className="pl-10 bg-slate-50"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-700 font-medium">
                                New Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="At least 6 characters"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="pl-10 bg-slate-50"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-6 rounded-xl shadow-lg transition-all duration-300"
                        >
                            {loading ? "Updating..." : "Reset Password"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center justify-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
