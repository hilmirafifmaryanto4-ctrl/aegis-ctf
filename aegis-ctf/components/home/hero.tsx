"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Terminal, Shield, Flag } from "lucide-react"

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-[128px] animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-ping" />
            AEGIS CTF 2026 IS LIVE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl"
          >
            <span className="text-foreground">SECURE THE</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-cyan-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              FUTURE
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            Join the elite cybersecurity competition. Test your skills in Web Exploitation, Cryptography, Reverse Engineering, and more.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg group font-mono">
                <span className="mr-2 text-primary-foreground/70">&gt;_</span>
                Start Hacking
              </Button>
            </Link>
            <Link href="/scoreboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg">
                <Flag className="mr-2 h-5 w-5" />
                View Scoreboard
              </Button>
            </Link>
          </motion.div>

          {/* Stats / Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 w-full max-w-4xl"
          >
            {[
              { icon: Shield, label: "Advanced Security", value: "Military Grade" },
              { icon: Terminal, label: "Challenges", value: "50+" },
              { icon: Flag, label: "Prize Pool", value: "$10,000" },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-primary/50"
              >
                <stat.icon className="h-8 w-8 text-primary mb-2" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
