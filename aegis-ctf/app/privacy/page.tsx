"use client"

import { Navbar } from "@/components/layout/navbar"
import { Shield } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl space-y-8">
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
              <Shield className="h-10 w-10 text-primary" />
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">Last updated: February 2026</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, participate in the competition, or communicate with us. This may include your username, email address, and IP address.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide, maintain, and improve the Aegis CTF platform.</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our services.</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities and protect the rights and property of Aegis CTF and others.</li>
                <li>Facilitate the competition, including scoring and ranking.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">3. Sharing of Information</h2>
              <p>
                We do not share your personal information with third parties except as described in this policy or with your consent. We may share aggregated or de-identified information that cannot reasonably be used to identify you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">4. Data Security</h2>
              <p>
                We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white">5. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us via the Contact page.
              </p>
            </section>
          </div>

        </div>
      </div>
    </div>
  )
}
