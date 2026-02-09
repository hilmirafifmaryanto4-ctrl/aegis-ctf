"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Flag, X, CheckCircle, XCircle } from "lucide-react"

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null)
  const [flagInput, setFlagInput] = useState("")
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  useEffect(() => {
    const fetchChallenges = async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('points', { ascending: true })
      
      if (data) setChallenges(data)
      setLoading(false)
    }
    fetchChallenges()
  }, [])

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

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto space-y-12">
        <h1 className="text-4xl font-bold text-white text-center">Challenges</h1>

        {loading ? (
          <div className="text-white text-center">Loading challenges...</div>
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
              </div>

              <div className="space-y-2">
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
  )
}
