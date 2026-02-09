"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { User, Mail, Calendar, Shield, Trophy, Target, CheckCircle } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    rank: "N/A",
    score: 0,
    solved: 0
  })
  const [recentSolves, setRecentSolves] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
        return
      }
      setUser(session.user)

      // Fetch Stats
      const { data: solves } = await supabase
        .from('solves')
        .select(`
          created_at,
          challenges (
            title,
            category,
            points
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (solves) {
        const totalScore = solves.reduce((acc, solve: any) => acc + (solve.challenges?.points || 0), 0)
        setStats({
          rank: "N/A", // Placeholder
          score: totalScore,
          solved: solves.length
        })
        setRecentSolves(solves)
      }

      setLoading(false)
    }
    getUser()
  }, [router])

  if (loading) return <div className="min-h-screen bg-black pt-24 text-white text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl space-y-8">
        
        {/* Profile Header */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
              <User className="h-12 w-12 text-primary" />
            </div>
            <div className="text-center md:text-left space-y-2 flex-1">
              <h1 className="text-3xl font-bold text-white">{user.user_metadata?.username || "Hacker"}</h1>
              <div className="flex flex-col md:flex-row gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-500/20 text-yellow-500">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Rank</p>
                <p className="text-2xl font-bold text-white">{stats.rank}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/20 text-blue-500">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Score</p>
                <p className="text-2xl font-bold text-white">{stats.score}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/20 text-green-500">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Challenges Solved</p>
                <p className="text-2xl font-bold text-white">{stats.solved}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Solves */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Recent Solves</h2>
          <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center text-sm text-muted-foreground">
              <span>Challenge</span>
              <span>Time</span>
            </div>
            {recentSolves.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No solves yet.</div>
            ) : (
                recentSolves.map((solve, i) => (
                <div key={i} className="p-4 border-b border-white/10 last:border-0 flex justify-between items-center hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-white font-medium">{solve.challenges?.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">{solve.challenges?.category}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{new Date(solve.created_at).toLocaleDateString()}</span>
                </div>
                ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
