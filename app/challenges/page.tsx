"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { ChallengeCard } from "@/components/challenges/challenge-card"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

// Mock Data
const categories = ["All", "Web", "Crypto", "Pwn", "Forensics", "Misc"]
const challenges = [
  { id: "1", title: "Welcome", category: "Misc", points: 10, solved: true, difficulty: "Easy", description: "Join our Discord and find the flag in the #rules channel." },
  { id: "2", title: "SQL Injection 101", category: "Web", points: 100, solved: false, difficulty: "Easy", description: "Can you bypass the login? http://chall.aegis.ctf:8001" },
  { id: "3", title: "Caesar Salad", category: "Crypto", points: 150, solved: false, difficulty: "Easy", description: "Decrypt this message: V unir n synt" },
  { id: "4", title: "Buffer Overflow", category: "Pwn", points: 300, solved: false, difficulty: "Medium", description: "Simple buffer overflow challenge. nc chall.aegis.ctf 1337" },
  { id: "5", title: "Memory Dump", category: "Forensics", points: 400, solved: false, difficulty: "Hard", description: "Find the password in this memory dump." },
  { id: "6", title: "RSA Madness", category: "Crypto", points: 500, solved: false, difficulty: "Hard", description: "Small e is dangerous." },
] as const

export default function ChallengesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedChallenge, setSelectedChallenge] = useState<typeof challenges[number] | null>(null)
  const [flag, setFlag] = useState("")

  const filteredChallenges = selectedCategory === "All" 
    ? challenges 
    : challenges.filter(c => c.category === selectedCategory)

  const handleSubmitFlag = (e: React.FormEvent) => {
    e.preventDefault()
    // Logic to submit flag would go here
    alert(`Submitting flag: ${flag} for challenge ${selectedChallenge?.id}`)
    setFlag("")
    setSelectedChallenge(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">Challenges</h1>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <ChallengeCard
                challenge={challenge}
                onClick={() => setSelectedChallenge(challenge)}
              />
            </motion.div>
          ))}
        </div>
      </main>

      <Modal
        isOpen={!!selectedChallenge}
        onClose={() => setSelectedChallenge(null)}
        title={selectedChallenge?.title || ""}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">{selectedChallenge?.category}</span>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">{selectedChallenge?.points} pts</span>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">{selectedChallenge?.difficulty}</span>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p>{selectedChallenge?.description}</p>
          </div>

          <form onSubmit={handleSubmitFlag} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Flag</label>
              <input
                type="text"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                placeholder="AegisCTF{...}"
                className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <Button type="submit" className="w-full">
              Submit Flag
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  )
}
