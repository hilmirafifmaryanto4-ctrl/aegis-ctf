"use client"

import { Navbar } from "@/components/layout/navbar"
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "What is a Capture The Flag (CTF) competition?",
      answer: "A Capture The Flag (CTF) competition is a cybersecurity exercise where participants solve security challenges to find hidden 'flags'. These flags are text strings (usually in a format like AEGIS{...}) that prove you have solved the challenge."
    },
    {
      question: "Who can participate?",
      answer: "Anyone! Whether you are a beginner interested in cybersecurity or a seasoned professional, our challenges range from introductory to advanced levels."
    },
    {
      question: "How do I score points?",
      answer: "Points are awarded when you submit the correct flag for a challenge. The harder the challenge, the more points it is usually worth. In dynamic scoring, points may decrease as more people solve the challenge."
    },
    {
      question: "Is brute-forcing allowed?",
      answer: "No. Brute-forcing flags on the submission platform is strictly prohibited and may lead to disqualification. You should find the flag through analysis and exploitation, not guessing."
    },
    {
      question: "What categories of challenges are available?",
      answer: "We offer challenges in Web Exploitation, Cryptography, Reverse Engineering, Forensics, Pwn (Binary Exploitation), and Miscellaneous categories."
    },
    {
      question: "I'm stuck on a challenge. Can I get help?",
      answer: "You can use the 'Hints' system available in some challenges. Note that unlocking hints may cost you points."
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl space-y-12">
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
              <HelpCircle className="h-10 w-10 text-primary" />
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground text-lg">Everything you need to know about Aegis CTF.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="rounded-xl border border-white/10 bg-white/5 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-lg font-medium text-white">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6 text-muted-foreground border-t border-white/10 pt-4 animate-in fade-in slide-in-from-top-2">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
