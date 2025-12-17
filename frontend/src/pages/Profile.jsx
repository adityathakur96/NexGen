"use client"

import { useState } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { User, Mail, Phone, Building, Save } from "lucide-react"

export default function Profile() {
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@nexgen.com",
    phone: "+1 (555) 123-4567",
    company: "NexGen Analytics",
    role: "Sales Manager",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Profile updated successfully!")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Profile Settings</h2>
        <p className="text-slate-600 mt-1">Manage your account information</p>
      </div>

      <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-lg border-slate-200">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-200">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            JD
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">{formData.name}</h3>
            <p className="text-slate-600">{formData.role}</p>
            <Button className="mt-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
              Change Avatar
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-slate-700 font-medium">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-slate-50 border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-slate-700 font-medium">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-slate-50 border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2 text-slate-700 font-medium">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="bg-slate-50 border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center gap-2 text-slate-700 font-medium">
                <Building className="w-4 h-4" />
                Company
              </Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="bg-slate-50 border-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-slate-200">
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
