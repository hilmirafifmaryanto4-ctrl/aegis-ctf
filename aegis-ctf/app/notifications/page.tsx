"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { Navbar } from "../../components/layout/navbar"
import { Megaphone, Bell, Info } from "lucide-react"

export default function NotificationsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setAnnouncements(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl space-y-8">
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
              <Bell className="h-10 w-10 text-primary" />
              Notifications
            </h1>
            <p className="text-muted-foreground">Stay updated with the latest news</p>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-white py-12">Loading notifications...</div>
            ) : announcements.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">No notifications yet.</div>
            ) : (
              announcements.map((ann, idx) => (
                <div key={ann.id} className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Megaphone className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white text-lg">{ann.content}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4" />
                      <span>{new Date(ann.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
