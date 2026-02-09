"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Navbar } from "@/components/layout/navbar"
import { User, Trophy, Crosshair, Calendar, Flag, Activity } from "lucide-react"
import { useParams } from "next/navigation"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

export default function UserProfilePage() {
  const { id } = useParams()
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    rank: "N/A",
    score: 0,
    solves: 0
  })
  const [solves, setSolves] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) fetchUserProfile()
  }, [id])

  const fetchUserProfile = async () => {
    // 1. Get Profile
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (userProfile) {
      setProfile(userProfile)
      
      // 2. Get Solves
      const { data: userSolves } = await supabase
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
        .eq('user_id', id)
        .order('created_at', { ascending: true }) // Ascending for chart

      if (userSolves) {
        setSolves(userSolves)
        
        // Calculate Score
        let currentScore = 0
        const timeline = userSolves.map((solve: any) => {
          currentScore += (solve.challenges?.points || 0)
          return {
            name: new Date(solve.created_at).toLocaleDateString(),
            score: currentScore,
            challenge: solve.challenges?.title
          }
        })
        
        setChartData(timeline)
        setStats(prev => ({
          ...prev,
          score: currentScore,
          solves: userSolves.length
        }))
      }
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading profile...
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-32 text-center text-white">
          <h1 className="text-2xl font-bold">User not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl space-y-8">
          
          {/* Header Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" /> {profile.full_name || "Hacker"}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> Joined {new Date(profile.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Rank</div>
                <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                   <Trophy className="h-5 w-5 text-yellow-500" /> {stats.rank}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Score</div>
                <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                   <Crosshair className="h-5 w-5 text-primary" /> {stats.score}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Solves</div>
                <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                   <Flag className="h-5 w-5 text-green-500" /> {stats.solves}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Chart */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Progression
              </h3>
              <div className="h-[300px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#666" tick={{fontSize: 12}} />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Line 
                        type="stepAfter" 
                        dataKey="score" 
                        stroke="#06b6d4" 
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#06b6d4" }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No data available
                  </div>
                )}
              </div>
            </div>

            {/* Solves List */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 max-h-[400px] overflow-y-auto">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Flag className="h-5 w-5 text-green-500" /> Solves ({solves.length})
              </h3>
              <div className="space-y-3">
                {solves.length === 0 ? (
                  <div className="text-muted-foreground text-center py-4">No solves yet</div>
                ) : (
                  [...solves].reverse().map((solve, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded bg-white/5 border border-white/10">
                      <div>
                        <div className="font-medium text-white">{solve.challenges?.title}</div>
                        <div className="text-xs text-muted-foreground">{solve.challenges?.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{solve.challenges?.points} pts</div>
                        <div className="text-[10px] text-muted-foreground">{new Date(solve.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
