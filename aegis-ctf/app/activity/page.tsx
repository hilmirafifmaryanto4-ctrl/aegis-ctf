"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Navbar } from "@/components/layout/navbar"
import { Activity, CheckCircle, Flag, User } from "lucide-react"
import Link from "next/link"

export default function ActivityPage() {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivity()
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('public:solves')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'solves' }, payload => {
        fetchActivity() // Simple refresh for now
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchActivity = async () => {
    const { data } = await supabase
      .from('solves')
      .select(`
        created_at,
        profiles (id, username),
        challenges (title, category, points)
      `)
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (data) setActivities(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl space-y-8">
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
              <Activity className="h-10 w-10 text-green-500" />
              Activity Feed
            </h1>
            <p className="text-muted-foreground">Live updates from the battlefield</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-white">Loading activity...</div>
            ) : activities.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">No activity yet.</div>
            ) : (
              <div className="divide-y divide-white/10">
                {activities.map((act, idx) => (
                  <div key={idx} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1 text-sm md:text-base">
                        <Link href={`/users/${act.profiles?.id}`} className="font-bold text-white hover:text-primary transition-colors">
                          {act.profiles?.username || "Unknown"}
                        </Link>
                        <span className="text-muted-foreground">solved</span>
                        <span className="font-bold text-primary">{act.challenges?.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-white">{act.challenges?.category}</span>
                        <span>•</span>
                        <span>{new Date(act.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-white text-lg">+{act.challenges?.points}</div>
                      <div className="text-xs text-muted-foreground">pts</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
