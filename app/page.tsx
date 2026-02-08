import { Navbar } from "@/components/layout/navbar"
import { Hero } from "@/components/home/hero"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      <Hero />
      <footer className="w-full border-t border-white/10 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 Aegis CTF. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
