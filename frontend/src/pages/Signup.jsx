"use client"

import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Mail, Lock, User, BarChart3, ArrowRight } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { signup } from "../lib/api"

export default function Signup() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        full_name: "",
        password: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            await signup(formData)
            navigate("/login", { state: { message: "Account created successfully! Please login." } })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
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
                            Create Account
                        </h1>
                        <p className="text-slate-600">Join NexGen Analytics today</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name" className="text-slate-700 font-medium">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <Input
                                    id="full_name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="pl-10 bg-slate-50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-slate-700 font-medium">Username</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="johndoe123"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="pl-10 bg-slate-50"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="pl-10 bg-slate-50"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Min. 6 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="pl-10 bg-slate-50"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                            {loading ? "Creating Account..." : "Sign Up"}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </Button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 pt-6">
                        <p className="text-slate-600 text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="text-purple-600 hover:text-purple-800 font-semibold transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
