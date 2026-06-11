import Image from "next/image"
import type { Team } from "@/lib/matches-data"

interface MatchHeaderProps {
  homeTeam: Team
  awayTeam: Team
  time: string
}

export function MatchHeader({ homeTeam, awayTeam, time }: MatchHeaderProps) {
    return (
  <div className="bg-card border border-border rounded-lg p-6">
    <div className="flex items-center justify-center gap-6 md:gap-10">

      {/* Home Team */}
      <div className="flex items-center gap-3">
        <span className="text-foreground font-semibold text-sm md:text-lg uppercase">
          {homeTeam.name}
        </span>

        <div className="w-10 h-10 md:w-12 md:h-12 relative flex-shrink-0">
          <Image
            src={homeTeam.logo}
            alt={`${homeTeam.name} logo`}
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Center */}
      <div className="flex flex-col items-center">
        <span className="text-primary font-bold text-xl md:text-3xl">
          X
        </span>

        <span className="text-muted-foreground text-sm">
          {time}
        </span>
      </div>

      {/* Away Team */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 md:w-12 md:h-12 relative flex-shrink-0">
          <Image
            src={awayTeam.logo}
            alt={`${awayTeam.name} logo`}
            fill
            className="object-contain"
          />
        </div>

        <span className="text-foreground font-semibold text-sm md:text-lg uppercase">
          {awayTeam.name}
        </span>
      </div>

    </div>
  </div>

  )
}

function TeamDisplay({ team }: { team: Team }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-foreground font-medium text-sm md:text-base uppercase hidden sm:block">
        {team.name}
      </span>
      <span className="text-foreground font-medium text-sm uppercase sm:hidden">
        {team.shortName}
      </span>
      <div className="w-10 h-10 md:w-12 md:h-12 relative flex-shrink-0">
        <Image
          src={team.logo}
          alt={`${team.name} logo`}
          fill
          className="object-contain"
        />
      </div>
    </div>
  )
}
