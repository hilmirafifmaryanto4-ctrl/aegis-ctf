"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Flag, X, CheckCircle, XCircle, Lock, Lightbulb, Unlock } from "lucide-react"
import Link from "next/link"

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null)
  const [flagInput, setFlagInput] = useState("")
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [hints, setHints] = useState<any[]>([])
  const [unlockedHints, setUnlockedHints] = useState<any[]>([])

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsAuthenticated(true)
        fetchChallenges()
      } else {
        setIsAuthenticated(false)
        setLoading(false)
      }
      setAuthChecking(false)
    }
    checkAuth()
  }, [])

  const fetchChallenges = async () => {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('points', { ascending: true })
    
    if (data) setChallenges(data)
    setLoading(false)
  }

  const fetchHints = async (challengeId: string) => {
    // 1. Fetch available hints for this challenge
    const { data: challengeHints } = await supabase
      .from('hints')
      .select('*')
      .eq('challenge_id', challengeId)
      .order('cost', { ascending: true })
    
    if (challengeHints) setHints(challengeHints)

    // 2. Fetch unlocked hints for this user
    const { data: unlocks } = await supabase
      .from('hint_unlocks')
      .select('hint_id')
    
    if (unlocks) setUnlockedHints(unlocks.map(u => u.hint_id))
  }

  const handleUnlockHint = async (hintId: string) => {
    if (!confirm("Unlock this hint? It might cost points.")) return

    const { data, error } = await supabase.rpc('unlock_hint', { p_hint_id: hintId })
    
    if (!error) {
      setUnlockedHints([...unlockedHints, hintId])
    } else {
      alert("Error unlocking hint: " + error.message)
    }
  }

  const categories = ["Web", "Crypto", "Pwn", "Forensics", "Reverse", "Misc"]

  const handleSubmitFlag = async () => {
    if (!selectedChallenge || !flagInput) return

    const { data, error } = await supabase.rpc('submit_flag', {
      p_challenge_id: selectedChallenge.id,
      p_flag: flagInput
    })

    if (data === true) {
      setSubmitStatus("success")
    } else {
      setSubmitStatus("error")
    }
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
              <div className="p-4 rounded-full bg-primary/10 text-primary">
                <Lock className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white">Challenges Locked</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our challenges are designed to test your cybersecurity skills across various categories including Web Exploitation, Cryptography, Reverse Engineering, and more.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto mt-8">
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <h3 className="text-lg font-bold text-primary mb-2">Learn & Practice</h3>
                <p className="text-sm text-muted-foreground">From beginner to advanced levels, sharpen your skills with hands-on security challenges.</p>
              </div>
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <h3 className="text-lg font-bold text-primary mb-2">Real-world Scenarios</h3>
                <p className="text-sm text-muted-foreground">Face vulnerabilities found in modern applications and learn how to exploit and patch them.</p>
              </div>
              <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                <h3 className="text-lg font-bold text-primary mb-2">Earn Points</h3>
                <p className="text-sm text-muted-foreground">Solve challenges to earn points, climb the leaderboard, and prove your expertise.</p>
              </div>
            </div>

            <p className="text-muted-foreground pt-4">
              Join Aegis CTF today to access all challenges and start your journey!
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
        <div className="container mx-auto space-y-12">
        <h1 className="text-4xl font-bold text-white text-center">Challenges</h1>

        {loading ? (
          <div className="text-white text-center">Loading challenges...</div>
        ) : challenges.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p className="text-xl">No challenges available yet.</p>
            <p className="text-sm mt-2">Check back later or contact the admin.</p>
          </div>
        ) : (
          categories.map(category => {
            const catChallenges = challenges.filter(c => c.category === category)
            if (catChallenges.length === 0) return null

            return (
              <div key={category} className="space-y-4">
                <h2 className="text-2xl font-bold text-primary border-b border-primary/20 pb-2">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {catChallenges.map(challenge => (
                    <button
                      key={challenge.id}
                      onClick={() => {
                        setSelectedChallenge(challenge)
                        setFlagInput("")
                        setSubmitStatus("idle")
                        fetchHints(challenge.id)
                      }}
                      className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all text-left group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-lg font-bold text-white group-hover:text-primary">{challenge.points}</span>
                        <Flag className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <h3 className="font-medium text-white truncate">{challenge.title}</h3>
                    </button>
                  ))}
                </div>
              </div>
            )
          })
        )}

        {/* Challenge Modal */}
        {selectedChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedChallenge.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">{selectedChallenge.category}</span>
                    <span className="text-xs px-2 py-1 rounded bg-white/10 text-white">{selectedChallenge.points} pts</span>
                  </div>
                </div>
                <button onClick={() => setSelectedChallenge(null)} className="text-muted-foreground hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="prose prose-invert max-w-none text-sm text-gray-300">
                <p>{selectedChallenge.description}</p>
                {/* File Links */}
                {selectedChallenge.files && selectedChallenge.files.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                     <p className="text-white font-medium mb-2">Attached Files:</p>
                     <div className="flex flex-wrap gap-2">
                       {selectedChallenge.files.map((file: string, idx: number) => (
                         <a 
                           key={idx} 
                           href={file} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded flex items-center gap-2 text-primary"
                         >
                           Download File {idx + 1}
                         </a>
                       ))}
                     </div>
                  </div>
                )}
              </div>

              {/* Hints */}
              {hints.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <h4 className="text-sm font-medium text-white flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" /> Hints
                  </h4>
                  <div className="grid gap-2">
                    {hints.map((hint) => {
                      const isUnlocked = unlockedHints.includes(hint.id)
                      return (
                        <div key={hint.id} className="text-sm p-3 rounded bg-white/5 border border-white/10">
                          {isUnlocked ? (
                            <p className="text-gray-300">{hint.content}</p>
                          ) : (
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground italic">Hint locked</span>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleUnlockHint(hint.id)}
                                className="h-7 text-xs gap-1"
                              >
                                <Unlock className="h-3 w-3" /> Unlock ({hint.cost} pts)
                              </Button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-4 border-t border-white/10">
                <label className="text-sm font-medium text-white">Flag</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                    placeholder="AEGIS{...}" 
                    className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary"
                  />
                  <Button onClick={handleSubmitFlag} disabled={submitStatus === 'success'}>
                    Submit
                  </Button>
                </div>
                {submitStatus === 'success' && (
                  <p className="text-green-500 text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Correct Flag!</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-500 text-sm flex items-center gap-2"><XCircle className="h-4 w-4" /> Incorrect Flag</p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
    </div>
  )
}
