"use client"

import { Button } from "../../components/ui/button"
import { Navbar } from "../../components/layout/navbar"
import { useState } from "react"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    // Here you would typically send the data to an API
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-2xl">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-12">
          
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl font-bold text-white">Contact Us</h1>
            <p className="text-muted-foreground">
              Have a question about the competition? Found a bug? Or just want to say hi? Send us a message!
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="text-5xl">✅</div>
              <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
              <p className="text-muted-foreground">We'll get back to you as soon as possible.</p>
              <Button onClick={() => setSubmitted(false)} variant="outline">Send another</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-white">Name</label>
                  <input id="name" required className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-primary focus:outline-none" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-white">Email</label>
                  <input id="email" type="email" required className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-primary focus:outline-none" placeholder="you@example.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-white">Subject</label>
                <input id="subject" required className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-primary focus:outline-none" placeholder="How can we help?" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-white">Message</label>
                <textarea id="message" required rows={5} className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-white focus:border-primary focus:outline-none" placeholder="Tell us more..." />
              </div>

              <Button type="submit" className="w-full" variant="primary">Send Message</Button>
            </form>
          )}

        </div>
      </div>
    </div>
    </div>
  )
}
