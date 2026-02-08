"use client"

import { Navbar } from "@/components/layout/navbar"
import { motion } from "framer-motion"
import { Activity, Award, CheckCircle, Crosshair } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
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
          <p className="text-muted-foreground mt-2">Welcome back, Hackerman</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Rank", value: "#42", icon: Award, color: "text-yellow-400" },
            { label: "Score", value: "1,337", icon: Crosshair, color: "text-primary" },
            { label: "Solved", value: "12", icon: CheckCircle, color: "text-green-400" },
            { label: "Accuracy", value: "85%", icon: Activity, color: "text-purple-400" },
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
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Solved &quot;Buffer Overflow&quot;</div>
                      <div className="text-sm text-muted-foreground">Pwn • 300 pts</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">2 hours ago</div>
                </div>
              ))}
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
