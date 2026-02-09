
export const getRankName = (points: number): { name: string, color: string } => {
  if (points >= 5000) return { name: "God Mode", color: "text-red-500" }
  if (points >= 2500) return { name: "Elite", color: "text-purple-500" }
  if (points >= 1000) return { name: "Pro Hacker", color: "text-cyan-500" }
  if (points >= 500) return { name: "Hacker", color: "text-green-500" }
  if (points >= 100) return { name: "Neophyte", color: "text-yellow-500" }
  return { name: "Script Kiddie", color: "text-gray-400" }
}

export const getRankBadge = (points: number) => {
  // Logic to return an icon or badge component name if needed
  // For now we just return colors and names
}
