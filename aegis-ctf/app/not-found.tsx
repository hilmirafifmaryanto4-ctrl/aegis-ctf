import Link from 'next/link'
import { AlertTriangle, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-red-500/10 flex items-center justify-center animate-pulse">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-white tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
        
        <p className="text-muted-foreground">
          The requested resource could not be found. It might have been moved, deleted, or never existed.
        </p>

        <div className="pt-4">
          <Link href="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
