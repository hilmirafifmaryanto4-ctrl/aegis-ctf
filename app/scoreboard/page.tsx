"use client"

import { Navbar } from "@/components/layout/navbar"
import { motion } from "framer-motion"
import { Trophy, Medal } from "lucide-react"

// Mock Data
const leaderboard = Array.from({ length: 20 }).map((_, i) => ({
  rank: i + 1,
  username: i === 0 ? "Hackerman" : `User_${1000 + i}`,
  score: Math.floor(10000 / (i + 1)) + 500,
  solves: Math.floor(50 / (i + 1)) + 5,
  lastSolve: "10 mins ago",
}))

export default function ScoreboardPage() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-400" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-300" />
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-muted-foreground font-mono">#{rank}</span>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">Scoreboard</h1>
          <p className="text-muted-foreground">Top hackers of Aegis CTF 2026</p>
        </motion.div>

        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Rank</th>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium text-right">Solves</th>
                  <th className="px-6 py-4 font-medium text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaderboard.map((user, index) => (
                  <motion.tr
                    key={user.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group hover:bg-white/5 transition-colors ${
                      user.rank <= 3 ? "bg-white/[0.02]" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getRankIcon(user.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                          {user.username.slice(0, 2).toUpperCase()}
                        </div>
                        {user.username}
                        {user.rank === 1 && (
                          <span className="inline-flex items-center rounded-full bg-yellow-400/10 px-2 py-0.5 text-xs font-medium text-yellow-400 border border-yellow-400/20">
                            Leader
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground">
                      {user.solves}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-primary">
                      {user.score}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
