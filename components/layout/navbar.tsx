"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Shield, LogOut, User, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useRouter, usePathname } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const navItems = user ? [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Challenges", href: "/challenges" },
    { name: "Scoreboard", href: "/scoreboard" },
    { name: "Users", href: "/users" },
    { name: "Activity", href: "/activity" },
    { name: "Rules", href: "/rules" },
  ] : [
    { name: "Home", href: "/" },
    { name: "Rules", href: "/rules" },
    { name: "Scoreboard", href: "/scoreboard" }, // Usually public
  ]

  useEffect(() => {
    // Check initial session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        setIsAdmin(profile?.role === 'admin')
      }
    }
    checkUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        setIsAdmin(profile?.role === 'admin')
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    // Force hard refresh to clear any cached states
    window.location.href = "/login"
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-8 w-8 items-center justify-center transition-all group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
            <img src="/logo.svg" alt="Aegis Logo" className="h-8 w-8 object-contain" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            AEGIS<span className="text-primary">CTF</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] ${
                pathname === item.href ? "text-primary drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium text-red-500 transition-colors hover:text-red-400 hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
            >
              Admin Panel
            </Link>
          )}
          <div className="flex items-center gap-4 ml-4">
            {user ? (
              <div className="flex items-center gap-4">
                 <Link href="/notifications">
                   <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary relative">
                     <Bell className="h-5 w-5" />
                     {/* We could add a badge here if we had notification count state */}
                   </Button>
                 </Link>
                 <Link href="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2 border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-white/10 bg-background md:hidden"
          >
            <div className="flex flex-col gap-4 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-red-500 hover:text-red-400"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                {user ? (
                  <>
                    <Link href="/notifications" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                      </Button>
                    </Link>
                    <Link href="/profile" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <User className="h-4 w-4" />
                        Profile
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        handleSignOut()
                        setIsOpen(false)
                      }}
                      className="w-full justify-start gap-2 border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">Login</Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <Button variant="primary" className="w-full">Register</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
