import { Navbar } from "@/components/layout/navbar"

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl space-y-12">
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Rules & Regulations</h1>
          <p className="text-muted-foreground">Play fair, play hard.</p>
        </div>

        <div className="space-y-8 text-gray-300">
          
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
            <h2 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
              🚫 Strictly Prohibited
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Do NOT attack the competition infrastructure (servers, database, scoring system). If you find a bug in the platform, report it.</li>
              <li>Do NOT attack other participants.</li>
              <li>Do NOT bruteforce/fuzz the flag submission system.</li>
              <li>Do NOT share flags or solutions with other teams before the competition ends.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold text-white mb-4">General Rules</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>The flag format is <code>AEGIS{"{...}"}</code> unless specified otherwise.</li>
              <li>You must submit the entire flag string including the wrapper.</li>
              <li>Decisions made by the admins are final.</li>
              <li>Have fun and learn something new!</li>
            </ul>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Scoring</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Points are awarded immediately upon correct flag submission.</li>
              <li>In case of a tie in points, the user who reached the score first ranks higher.</li>
              <li>Some challenges may have dynamic scoring (points decrease as more people solve them) - <i>Coming Soon</i>.</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
    </div>
  )
}
