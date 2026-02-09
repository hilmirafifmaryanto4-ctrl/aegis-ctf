"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { motion } from "framer-motion"
import { Activity, Award, CheckCircle, Crosshair } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    rank: "Unranked",
    score: 0,
    solved: 0,
    accuracy: "0%"
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      // 1. Get User
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
        return
      }
      setUser(session.user)

      const userId = session.user.id

      // 2. Get Solves & Score
      const { data: solves, error } = await supabase
        .from('solves')
        .select(`
          created_at,
          challenges (
            id,
            title,
            category,
            points
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (solves) {
        // Calculate Total Score
        const totalScore = solves.reduce((acc, solve: any) => acc + (solve.challenges?.points || 0), 0)
        
        // Calculate Solved Count
        const solvedCount = solves.length

        // Recent Activity (Top 5)
        setRecentActivity(solves.slice(0, 5))

        // TODO: Calculate Rank (Complex query, requires comparing with all users)
        // For now, we'll keep it simple or fetch from a leaderboard view if it exists.
        
        setStats({
          rank: "N/A", // Placeholder until we implement full leaderboard logic
          score: totalScore,
          solved: solvedCount,
          accuracy: solvedCount > 0 ? "100%" : "0%" // Simplified accuracy
        })
      }

      setLoading(false)
    }

    fetchData()
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, <span className="text-primary font-bold">{user?.user_metadata?.username || user?.email?.split('@')[0] || "Hacker"}</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Rank", value: stats.rank, icon: Award, color: "text-yellow-400" },
            { label: "Score", value: stats.score, icon: Crosshair, color: "text-primary" },
            { label: "Solved", value: stats.solved, icon: CheckCircle, color: "text-green-400" },
            { label: "Accuracy", value: stats.accuracy, icon: Activity, color: "text-purple-400" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Solves */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Recent Activity</h2>
            <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">Loading activity...</div>
              ) : recentActivity.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No activity yet. Start solving challenges!
                </div>
              ) : (
                recentActivity.map((solve, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Solved &quot;{solve.challenges?.title}&quot;</div>
                        <div className="text-sm text-muted-foreground">
                          {solve.challenges?.category} • {solve.challenges?.points} pts
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(solve.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end">
                <Link href="/challenges">
                    <Button>Go to Challenges</Button>
                </Link>
            </div>
          </div>

          {/* Announcements / Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Announcements</h2>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
              <div className="border-l-2 border-primary pl-4">
                <div className="font-medium text-foreground">CTF Started!</div>
                <div className="text-sm text-muted-foreground mt-1">The competition has officially begun. Good luck!</div>
              </div>
              <div className="border-l-2 border-purple-500 pl-4">
                <div className="font-medium text-foreground">New Challenge Added</div>
                <div className="text-sm text-muted-foreground mt-1">Check out &quot;Crypto 2&quot; in the Crypto category.</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
