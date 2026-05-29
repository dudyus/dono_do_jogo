import Image from "next/image"
import Link from "next/link"

interface Team {
  name: string
  logo: string
}

interface MatchCardProps {
  slug: string
  homeTeam: Team
  awayTeam: Team
  time: string
  betTip: string
}

export function MatchCard({ slug, homeTeam, awayTeam, time, betTip }: MatchCardProps) {
  return (
    <Link href={`/partida/${slug}`} className="block">
      <div className="bg-card border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4 transition-colors cursor-pointer">
        
        {/* Teams Section */}
        <div className="flex-1 flex flex-col gap-3">
          <TeamRow team={homeTeam} />
          <TeamRow team={awayTeam} />
        </div>

        {/* Time Section */}
        <div className="flex items-center justify-center md:min-w-[80px]">
          <span className="text-foreground font-medium text-lg">{time}</span>
        </div>

        {/* Bet Tip Section */}
        <div className="flex-1 flex flex-col items-start md:items-end gap-2">
          <span className="text-yellow-300 text-xs">
            Melhor aposta da partida:
          </span>

          <div className="bg-primary/20 border border-primary text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/30 transition-colors">
            {betTip}
          </div>
        </div>

      </div>
    </Link>
  )
}

function TeamRow({ team }: { team: Team }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 relative flex-shrink-0">
        <Image
          src={team.logo}
          alt={`${team.name} logo`}
          fill
          className="object-contain"
        />
      </div>
      <span className="text-foreground text-sm font-medium uppercase">{team.name}</span>
    </div>
  )
}
