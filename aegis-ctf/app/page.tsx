import { Navbar } from "../components/layout/navbar"
import { Hero } from "../components/home/hero"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      <Hero />
      {/* Footer is already included globally in layout.tsx, removing duplicate footer here */}
    </main>
  )
}
