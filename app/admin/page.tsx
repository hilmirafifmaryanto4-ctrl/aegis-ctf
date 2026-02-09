"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Shield, Plus, Trash2 } from "lucide-react"

import { Navbar } from "@/components/layout/navbar"

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "Web",
    description: "",
    points: 100,
    flag: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const { error } = await supabase.from('challenges').insert([formData])

    if (error) {
      setMessage("Error creating challenge: " + error.message)
    } else {
      setMessage("Challenge created successfully!")
      setFormData({
        title: "",
        category: "Web",
        description: "",
        points: 100,
        flag: "",
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 md:px-6">
      <div className="container mx-auto max-w-2xl space-y-8">
        
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <div className="p-3 rounded-lg bg-red-500/20 text-red-500">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage challenges and configuration</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Create New Challenge
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Title</label>
              <input 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-primary focus:outline-none"
                placeholder="e.g. SQL Injection 101"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-primary focus:outline-none"
                >
                  <option value="Web">Web Exploitation</option>
                  <option value="Crypto">Cryptography</option>
                  <option value="Pwn">Pwn / Binary</option>
                  <option value="Forensics">Forensics</option>
                  <option value="Reverse">Reverse Engineering</option>
                  <option value="Misc">Miscellaneous</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Points</label>
                <input 
                  type="number"
                  required
                  value={formData.points}
                  onChange={e => setFormData({...formData, points: parseInt(e.target.value)})}
                  className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Description (Markdown supported)</label>
              <textarea 
                required
                rows={5}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-primary focus:outline-none"
                placeholder="Describe the challenge..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Flag</label>
              <input 
                required
                value={formData.flag}
                onChange={e => setFormData({...formData, flag: e.target.value})}
                className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-primary focus:outline-none"
                placeholder="AEGIS{secret_flag_here}"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-md ${message.includes("Error") ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"}`}>
                {message}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Challenge"}
            </Button>
          </form>
        </div>

      </div>
    </div>
    </div>
  )
}
