import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Glitch Effect Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative z-10 text-center space-y-8 px-4">
        <h1 className="text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 animate-pulse">
          404
        </h1>
        
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-red-500">
            SYSTEM FAILURE: TARGET NOT FOUND
          </h2>
          <p className="text-muted-foreground max-w-[600px] mx-auto">
            The requested resource could not be located in the system memory. It may have been deleted, moved, or corrupted by a buffer overflow attack.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10">
              Return to Base
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="lg">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
