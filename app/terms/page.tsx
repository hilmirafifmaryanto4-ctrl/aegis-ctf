"use client"

import { Navbar } from "@/components/layout/navbar"
import { FileText } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl space-y-8">
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
              <FileText className="h-10 w-10 text-primary" />
              Terms of Service
            </h1>
            <p className="text-muted-foreground">Last updated: February 2026</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Aegis CTF platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">2. Use License</h2>
              <p>
                Permission is granted to temporarily access the materials (challenges, information, software) on Aegis CTF's website for personal, non-commercial transitory viewing and participation in the competition.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">3. User Conduct</h2>
              <p>
                You agree not to engage in any of the following prohibited activities:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the Service.</li>
                <li>Taking any action that imposes, or may impose at our sole discretion an unreasonable or disproportionately large load on our infrastructure.</li>
                <li>Uploading invalid data, viruses, worms, or other software agents through the Service.</li>
                <li>Sharing solutions or flags with other participants during the active competition period.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">4. Disclaimer</h2>
              <p>
                The materials on Aegis CTF's website are provided on an 'as is' basis. Aegis CTF makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">5. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of Indonesia and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
              </p>
            </section>
          </div>

        </div>
      </div>
    </div>
  )
}
