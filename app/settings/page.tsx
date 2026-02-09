"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Navbar } from "@/components/layout/navbar"
import { Settings, User, Lock, Save, Github, Twitter, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    website: "",
    github: "",
    twitter: "",
  })
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push("/login")
      return
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    
    if (data) {
      setProfile(data)
      setFormData({
        full_name: data.full_name || "",
        website: data.website || "",
        github: data.github || "",
        twitter: data.twitter || ""
      })
    }
    setLoading(false)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const { error } = await supabase
      .from('profiles')
      .update(formData)
      .eq('id', profile.id)
    
    if (error) {
      alert("Error updating profile: " + error.message)
    } else {
      alert("Profile updated successfully!")
    }
    setSaving(false)
  }

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-2xl space-y-8">
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
              <Settings className="h-10 w-10 text-gray-400" />
              Settings
            </h1>
            <p className="text-muted-foreground">Manage your account preferences</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <form onSubmit={handleUpdate} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <User className="h-4 w-4" /> Full Name
                </label>
                <input 
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                  className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-primary focus:outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Website
                </label>
                <input 
                  value={formData.website}
                  onChange={e => setFormData({...formData, website: e.target.value})}
                  className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-primary focus:outline-none"
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <Github className="h-4 w-4" /> GitHub Username
                </label>
                <input 
                  value={formData.github}
                  onChange={e => setFormData({...formData, github: e.target.value})}
                  className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-primary focus:outline-none"
                  placeholder="johndoe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <Twitter className="h-4 w-4" /> Twitter Username
                </label>
                <input 
                  value={formData.twitter}
                  onChange={e => setFormData({...formData, twitter: e.target.value})}
                  className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-primary focus:outline-none"
                  placeholder="@johndoe"
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>

            </form>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6 flex items-center justify-between">
             <div>
               <h3 className="text-lg font-bold text-red-500 flex items-center gap-2">
                 <Lock className="h-5 w-5" /> Change Password
               </h3>
               <p className="text-sm text-gray-400 mt-1">Update your password securely.</p>
             </div>
             <Button variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10">
               Update Password
             </Button>
          </div>

        </div>
      </div>
    </div>
  )
}
