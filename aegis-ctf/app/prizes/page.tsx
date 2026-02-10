"use client"

import { Navbar } from "../../components/layout/navbar"
import { Trophy, Gift, Award, Star } from "lucide-react"

export default function PrizesPage() {
  const prizes = [
    {
      rank: "1st Place",
      reward: "Rp 5.000.000",
      perks: ["Champion Trophy", "Exclusive Merch", "Certificate of Excellence", "VIP Access to Next Event"],
      icon: Trophy,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/50"
    },
    {
      rank: "2nd Place",
      reward: "Rp 3.000.000",
      perks: ["Runner-up Trophy", "Exclusive Merch", "Certificate of Achievement"],
      icon: Award,
      color: "text-gray-400",
      bg: "bg-gray-400/10",
      border: "border-gray-400/50"
    },
    {
      rank: "3rd Place",
      reward: "Rp 1.500.000",
      perks: ["Bronze Trophy", "Exclusive Merch", "Certificate of Achievement"],
      icon: Award,
      color: "text-amber-700",
      bg: "bg-amber-700/10",
      border: "border-amber-700/50"
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl space-y-12">
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
              <Gift className="h-10 w-10 text-primary" />
              Prizes & Rewards
            </h1>
            <p className="text-muted-foreground text-lg">Compete for glory and amazing prizes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {prizes.map((prize, index) => (
              <div 
                key={index} 
                className={`rounded-2xl border ${prize.border} ${prize.bg} p-8 text-center space-y-6 transform hover:-translate-y-2 transition-transform duration-300`}
              >
                <div className={`h-20 w-20 mx-auto rounded-full ${prize.bg} flex items-center justify-center border-2 ${prize.border}`}>
                  <prize.icon className={`h-10 w-10 ${prize.color}`} />
                </div>
                
                <div className="space-y-2">
                  <h2 className={`text-2xl font-bold ${prize.color}`}>{prize.rank}</h2>
                  <div className="text-4xl font-bold text-white">{prize.reward}</div>
                </div>

                <div className="space-y-3 text-left bg-black/20 rounded-xl p-4">
                  {prize.perks.map((perk, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <Star className={`h-4 w-4 ${prize.color} flex-shrink-0 mt-0.5`} />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center space-y-4">
            <h3 className="text-xl font-bold text-white">Special Category Prizes</h3>
            <p className="text-muted-foreground">
              Additional prizes will be awarded for "First Blood" on specific challenges and "Best Write-up".
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
