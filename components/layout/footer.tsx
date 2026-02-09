import Link from "next/link"
import { Shield, Github, Twitter, Disc } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative flex h-8 w-8 items-center justify-center transition-all group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                <img src="/aegis.png" alt="Aegis Logo" className="h-8 w-8 object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                AEGIS<span className="text-primary">CTF</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Secure The Future. Join the elite cybersecurity competition and test your skills.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Competition</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/challenges" className="hover:text-primary transition-colors">Challenges</Link></li>
              <li><Link href="/scoreboard" className="hover:text-primary transition-colors">Scoreboard</Link></li>
              <li><Link href="/rules" className="hover:text-primary transition-colors">Rules</Link></li>
              <li><Link href="/prizes" className="hover:text-primary transition-colors">Prizes</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/sponsors" className="hover:text-primary transition-colors">Sponsors</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Connect</h3>
            <div className="flex gap-4">
              <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                <Disc className="h-5 w-5" /> {/* Discord icon placeholder */}
              </Link>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Aegis CTF. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
