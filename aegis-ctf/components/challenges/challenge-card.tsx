"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { cn } from "../../lib/utils"

interface ChallengeCardProps {
  challenge: {
    id: string
    title: string
    points: number
    category: string
    solved: boolean
    difficulty: "Easy" | "Medium" | "Hard"
  }
  onClick: () => void
}

export function ChallengeCard({ challenge, onClick }: ChallengeCardProps) {
  const difficultyColor = {
    Easy: "text-green-400 border-green-400/20 bg-green-400/5",
    Medium: "text-yellow-400 border-yellow-400/20 bg-yellow-400/5",
    Hard: "text-red-400 border-red-400/20 bg-red-400/5",
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]",
        challenge.solved && "border-green-500/30 bg-green-500/5 opacity-80"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {challenge.category}
          </span>
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {challenge.title}
          </h3>
        </div>
        {challenge.solved ? (
          <CheckCircle className="h-6 w-6 text-green-500" />
        ) : (
          <div className="text-xl font-bold text-primary">{challenge.points}</div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium border",
            difficultyColor[challenge.difficulty]
          )}
        >
          {challenge.difficulty}
        </span>
        <span className="text-xs text-muted-foreground">
          {challenge.solved ? "Solved" : "Unsolved"}
        </span>
      </div>
    </motion.div>
  )
}
