import { MatchCard } from "./match-card"
import { matches } from "@/lib/matches-data"

export function MatchList() {
  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          slug={match.slug}
          homeTeam={match.homeTeam}
          awayTeam={match.awayTeam}
          time={match.time}
          betTip={match.betTip}
        />
      ))}
    </div>
  )
}
