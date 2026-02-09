"use client"

import { Navbar } from "@/components/layout/navbar"
import { Heart, Globe, Twitter, Github } from "lucide-react"
import Link from "next/link"

export default function SponsorsPage() {
  const sponsors = [
    {
      name: "CyberGuard Solutions",
      tier: "Diamond",
      description: "Leading provider of enterprise cybersecurity solutions.",
      logo: "/sponsors/cyberguard.png", // Placeholder
      color: "from-cyan-500 to-blue-500"
    },
    {
      name: "SecureNet Inc.",
      tier: "Gold",
      description: "Network security and monitoring experts.",
      logo: "/sponsors/securenet.png",
      color: "from-yellow-500 to-amber-500"
    },
    {
      name: "HackThePlanet Foundation",
      tier: "Silver",
      description: "Non-profit organization supporting ethical hacking.",
      logo: "/sponsors/htp.png",
      color: "from-gray-400 to-gray-600"
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl space-y-12">
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
              <Heart className="h-10 w-10 text-red-500" />
              Our Sponsors
            </h1>
            <p className="text-muted-foreground text-lg">
              We thank these amazing organizations for making Aegis CTF possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sponsors.map((sponsor, index) => (
              <div 
                key={index} 
                className="relative group rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-primary/50 transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${sponsor.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="p-8 space-y-6 relative z-10">
                  <div className="h-32 w-full bg-white/5 rounded-xl flex items-center justify-center text-muted-foreground text-sm border border-white/5 border-dashed">
                    {/* Placeholder for Logo */}
                    {sponsor.name} Logo
                  </div>
                  
                  <div className="space-y-2 text-center">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${sponsor.color} text-black mb-2`}>
                      {sponsor.tier} Sponsor
                    </div>
                    <h3 className="text-2xl font-bold text-white">{sponsor.name}</h3>
                    <p className="text-muted-foreground">{sponsor.description}</p>
                  </div>

                  <div className="flex justify-center gap-4 pt-4 border-t border-white/10">
                    <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                      <Globe className="h-5 w-5" />
                    </Link>
                    <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                      <Twitter className="h-5 w-5" />
                    </Link>
                    <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                      <Github className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-12 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Interested in Sponsoring?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Connect with thousands of security enthusiasts and professionals. Help us build the next generation of cyber defenders.
            </p>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
              Become a Sponsor
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
