"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Navbar } from "@/components/layout/navbar"
import { Trophy, Medal, User } from "lucide-react"

export default function ScoreboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      // Fetch all solves joined with challenge points
      const { data: solves, error } = await supabase
        .from('solves')
        .select(`
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

      // Calculate scores
      const userScores: Record<string, number> = {}
      
      solves?.forEach((solve: any) => {
        const uid = solve.user_id
        const points = solve.challenges?.points || 0
        userScores[uid] = (userScores[uid] || 0) + points
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
      setLoading(false)
    }

    fetchLeaderboard()
  }, [])

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
