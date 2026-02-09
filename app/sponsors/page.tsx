import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center space-y-16">
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">Our Sponsors</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Aegis CTF wouldn't be possible without the generous support of these amazing organizations who believe in the future of cybersecurity.
          </p>
        </div>

        {/* Tier 1: Platinum */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-yellow-400 uppercase tracking-widest">Platinum Sponsors</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 w-64 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <span className="text-muted-foreground font-bold">LOGO HERE</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2: Gold */}
        <div className="space-y-8">
          <h2 className="text-xl font-bold text-gray-300 uppercase tracking-widest">Gold Sponsors</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 w-48 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <span className="text-muted-foreground font-medium">LOGO HERE</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-primary/10 border border-primary/20 p-12 mt-16">
          <h3 className="text-2xl font-bold text-white mb-4">Interested in Sponsoring?</h3>
          <p className="text-muted-foreground mb-8">
            Connect with thousands of cybersecurity talents and showcase your brand to the next generation of hackers.
          </p>
          <a href="/contact" className="px-8 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary/80 transition-colors">
            Contact Us
          </a>
        </div>

      </div>
    </div>
    </div>
  )
}
