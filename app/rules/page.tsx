"use client"

import { Navbar } from "@/components/layout/navbar"
import { motion } from "framer-motion"
import { AlertTriangle, ShieldCheck, Users, Zap } from "lucide-react"

export default function RulesPage() {
  const rules = [
    {
      icon: ShieldCheck,
      title: "Fair Play",
      description: "Do not attack the infrastructure. If you find a bug in the platform, report it. Do not share flags.",
    },
    {
      icon: Users,
      title: "Teamwork",
      description: "Collaboration is allowed within teams, but cross-team sharing of solutions/flags is strictly prohibited.",
    },
    {
      icon: AlertTriangle,
      title: "Brute Force",
      description: "Do not brute force the challenges unless explicitly stated. Automated scanners are generally banned.",
    },
    {
      icon: Zap,
      title: "Denial of Service",
      description: "DoS/DDoS attacks are strictly forbidden. Any attempt will result in immediate disqualification.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">Rules & Regulations</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Please read the rules carefully. Violation of any rule may lead to disqualification.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {rules.map((rule, index) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4 p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-primary/50 transition-colors"
            >
              <div className="shrink-0">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <rule.icon className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">{rule.title}</h3>
                <p className="text-muted-foreground">{rule.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground">
            By participating in Aegis CTF 2026, you agree to these terms.
          </p>
        </motion.div>
      </main>
    </div>
  )
}
