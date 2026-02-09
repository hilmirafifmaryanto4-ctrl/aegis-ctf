import { Navbar } from "@/components/layout/navbar"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl space-y-12 text-white">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            About Aegis CTF
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The ultimate cybersecurity competition designed to test your skills, push your limits, and connect you with the global hacker community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Aegis CTF was founded with a single goal: to provide a platform where security enthusiasts, students, and professionals can hone their skills in a realistic, challenging, and fun environment. We believe that practical experience is the best teacher in cybersecurity.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether you are a beginner just starting with grep or a seasoned veteran reverse-engineering malware, there is a place for you here.
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8 h-full flex items-center justify-center">
            {/* Placeholder for Image */}
            <div className="text-center space-y-4">
              <div className="text-6xl">🛡️</div>
              <p className="text-sm text-muted-foreground">Secure The Future</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Web Exploitation", desc: "Find vulnerabilities in web applications." },
              { title: "Cryptography", desc: "Break codes and decipher secrets." },
              { title: "Reverse Engineering", desc: "Analyze binary files to understand how they work." },
              { title: "Forensics", desc: "Investigate digital evidence and artifacts." },
              { title: "Pwn / Binary", desc: "Exploit memory corruption vulnerabilities." },
              { title: "OSINT", desc: "Gather intelligence from open sources." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-bold mb-2 text-primary">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
    </div>
  )
}
