"use client"

import { Navbar } from "@/components/layout/navbar"
import { Shield, AlertTriangle, Check, XCircle } from "lucide-react"

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl space-y-12">
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">Rules & Regulations</h1>
            <p className="text-muted-foreground text-lg">Play fair, learn fast, and have fun.</p>
          </div>

          <div className="grid gap-8">
            {/* General Rules */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Shield className="h-6 w-6" /> General Rules
              </h2>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">This is a cybersecurity educational competition. The goal is to learn.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Flags are in the format <code>AEGIS&#123;secret_flag_here&#125;</code> unless specified otherwise.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Decisions made by the admins are final.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Prohibited Actions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-red-500 flex items-center gap-2">
                <XCircle className="h-6 w-6" /> Prohibited Actions
              </h2>
              <div className="rounded-xl border border-red-500/20 bg-red-950/10 p-6 space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Do not attack the competition infrastructure (CTFd platform, database, etc.). Only attack the challenge instances designated.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Do not share flags or solutions with other players during the competition.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Do not perform Denial of Service (DoS) attacks on any target.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Brute-forcing flags on the submission system is strictly prohibited and monitored.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Disqualification */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" /> Disqualification
              </h2>
              <div className="rounded-xl border border-yellow-500/20 bg-yellow-950/10 p-6">
                <p className="text-gray-300 leading-relaxed">
                  Violation of any of the rules above may result in immediate disqualification of the user or team. 
                  If you find a bug in the infrastructure, please report it to the admins immediately instead of exploiting it. 
                  Responsible disclosure may be rewarded.
                </p>
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  )
}
