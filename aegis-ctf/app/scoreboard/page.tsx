"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Navbar } from "@/components/layout/navbar"
import { Trophy, Medal, User, Lock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

export default function ScoreboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsAuthenticated(true)
        fetchLeaderboard()
      } else {
        setIsAuthenticated(false)
        setLoading(false)
      }
      setAuthChecking(false)
    }
    checkAuth()

    // Real-time subscription for solves
    const solvesSubscription = supabase
      .channel('public:solves')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'solves' }, () => {
        fetchLeaderboard()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(solvesSubscription)
    }
  }, [])

  const fetchLeaderboard = async () => {
    // Fetch all solves joined with challenge points
    const { data: solves, error } = await supabase
      .from('solves')
      .select(`
        created_at,
        user_id,
        challenges (
          points
        )
      `)

    if (error) {
      console.error("Error fetching scoreboard:", error)
      setLoading(false)
      return
    }

    // Fetch profiles to get usernames
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username')
    
    const profileMap: Record<string, string> = {}
    profiles?.forEach((p: any) => {
      profileMap[p.id] = p.username || "Anonymous"
    })

    // Calculate scores and chart data
    const userScores: Record<string, number> = {}
    const solvesByTime: any[] = []

    solves?.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

    // Initialize chart data with 0 scores for top users (will refine logic)
    // Simplified chart logic: Cumulative score over time
    // Group solves by hour/day for chart
    
    solves?.forEach((solve: any) => {
      const uid = solve.user_id
      const points = solve.challenges?.points || 0
      userScores[uid] = (userScores[uid] || 0) + points
    })

    // Prepare chart data (Cumulative scores of top 5 users over time)
    // 1. Get Top 5 Users
    const topUsers = Object.entries(userScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => id)

    // 2. Build cumulative timeline
    const timeline: any[] = []
    const currentScores: Record<string, number> = {}
    topUsers.forEach(id => currentScores[id] = 0)

    solves?.forEach((solve: any) => {
      if (topUsers.includes(solve.user_id)) {
        currentScores[solve.user_id] += (solve.challenges?.points || 0)
        
        timeline.push({
          time: new Date(solve.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: new Date(solve.created_at).getTime(),
          ...currentScores
        })
      }
    })

    // Convert to array and sort
    const sortedLeaderboard = Object.entries(userScores)
      .map(([id, score]) => ({ 
        id, 
        score, 
        username: profileMap[id] || "Hacker_" + id.slice(0, 4) 
      }))
      .sort((a, b) => b.score - a.score)
    
    setLeaderboard(sortedLeaderboard)
    setChartData(timeline)
    setLoading(false)
  }

  if (authChecking) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-32 text-center text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-24 pb-12 px-4 md:px-6">
          <div className="container mx-auto max-w-4xl text-center space-y-8 py-12">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-yellow-500/10 text-yellow-500">
                <Trophy className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white">Scoreboard Hidden</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The battlefield where hackers prove their worth. See who dominates the leaderboard in real-time.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto mt-8">
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <h3 className="text-lg font-bold text-yellow-500 mb-2">Real-time Ranking</h3>
                <p className="text-sm text-muted-foreground">Watch as the leaderboard updates instantly with every correct submission.</p>
              </div>
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <h3 className="text-lg font-bold text-yellow-500 mb-2">Global Competition</h3>
                <p className="text-sm text-muted-foreground">Compete against security enthusiasts and professionals from around the world.</p>
              </div>
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <h3 className="text-lg font-bold text-yellow-500 mb-2">Rise to Glory</h3>
                <p className="text-sm text-muted-foreground">Solve harder challenges to earn more points and secure your spot at the top.</p>
              </div>
            </div>

            <p className="text-muted-foreground pt-4">
              Login to view the current standings and see where you rank among the best.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Link href="/login">
                <Button variant="outline" size="lg">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="lg">Register Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl space-y-8">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Trophy className="h-10 w-10 text-yellow-500" />
            Scoreboard
          </h1>
          <p className="text-muted-foreground">Top hackers of Aegis CTF</p>
        </div>

        {/* Score History Chart */}
        {!loading && leaderboard.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Score History (Top 5)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  {leaderboard.slice(0, 5).map((user, index) => (
                    <Line 
                      key={user.id}
                      type="stepAfter" 
                      dataKey={user.id} 
                      name={user.username}
                      stroke={`hsl(${index * 60}, 70%, 50%)`} 
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 text-sm font-medium text-muted-foreground w-20 text-center">Rank</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground">User</th>
                  <th className="p-4 text-sm font-medium text-muted-foreground text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-muted-foreground">Loading scoreboard...</td>
                  </tr>
                ) : leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-muted-foreground">No solves yet. Be the first!</td>
                  </tr>
                ) : (
                  leaderboard.map((entry, index) => (
                    <tr key={entry.id} className="border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center">
                        {index === 0 ? (
                          <div className="flex justify-center"><Medal className="h-6 w-6 text-yellow-500" /></div>
                        ) : index === 1 ? (
                          <div className="flex justify-center"><Medal className="h-6 w-6 text-gray-400" /></div>
                        ) : index === 2 ? (
                          <div className="flex justify-center"><Medal className="h-6 w-6 text-amber-700" /></div>
                        ) : (
                          <span className="text-white font-bold text-lg">{index + 1}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-white font-medium">{entry.username}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-xl font-bold text-primary">{entry.score}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
    </div>
  )
}
