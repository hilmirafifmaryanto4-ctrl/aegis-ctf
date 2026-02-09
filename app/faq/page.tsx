import { Navbar } from "@/components/layout/navbar"

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl space-y-12">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">
            Got questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "What is a CTF?",
              a: "Capture The Flag (CTF) is a cybersecurity competition where participants solve security challenges to find a hidden text string, called a 'flag'. Submitting the flag earns you points."
            },
            {
              q: "Who can participate?",
              a: "Anyone! Aegis CTF is open to students, professionals, and hobbyists from all over the world. We have challenges ranging from beginner to expert level."
            },
            {
              q: "Do I need a team?",
              a: "You can participate solo or in a team. Teams are limited to 4 members. If you don't have a team, you can join our Discord to find teammates."
            },
            {
              q: "Is it free?",
              a: "Yes, participation is 100% free."
            },
            {
              q: "What tools do I need?",
              a: "A laptop with a Linux VM (Kali or Parrot) is recommended. You'll need tools like Burp Suite, Ghidra, Python, and GDB depending on the challenge."
            }
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">{item.q}</h3>
                <p className="text-muted-foreground">{item.a}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
    </div>
  )
}
