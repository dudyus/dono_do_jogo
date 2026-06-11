import { OddsCard } from "./odds-card"

interface OddsGridProps {
  homeTeamShort: string
  awayTeamShort: string
}

const bookmakers = [
  { name: "Bet365", homeOdds: 1.87, drawOdds: 3.30, awayOdds: 4.40 },
  { name: "KTO", homeOdds: 1.90, drawOdds: 3.35, awayOdds: 4.50 },
  { name: "Esportes da sorte", homeOdds: 1.92, drawOdds: 3.31, awayOdds: 4.40 },
  { name: "Betano", homeOdds: 1.90, drawOdds: 3.30, awayOdds: 4.50 },
  { name: "SportingBet", homeOdds: 1.82, drawOdds: 3.23, awayOdds: 4.40 },
  { name: "Pixbet", homeOdds: 1.91, drawOdds: 3.35, awayOdds: 4.45 },
  { name: "BetNacional", homeOdds: 1.89, drawOdds: 3.30, awayOdds: 4.50 },
  { name: "H2bet", homeOdds: 1.90, drawOdds: 3.30, awayOdds: 4.50 },
  { name: "Betfair", homeOdds: 1.86, drawOdds: 3.25, awayOdds: 4.60 },
  { name: "Rei do Pitaco", homeOdds: 1.85, drawOdds: 3.30, awayOdds: 4.50 },
  { name: "Stake", homeOdds: 1.88, drawOdds: 3.30, awayOdds: 4.50 },
  { name: "1xBet", homeOdds: 1.92, drawOdds: 3.35, awayOdds: 4.45 },
]

export function OddsGrid({ homeTeamShort, awayTeamShort }: OddsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {bookmakers.map((bookmaker) => (
        <OddsCard
          key={bookmaker.name}
          bookmaker={bookmaker.name}
          homeTeamShort={homeTeamShort}
          awayTeamShort={awayTeamShort}
          homeOdds={bookmaker.homeOdds}
          drawOdds={bookmaker.drawOdds}
          awayOdds={bookmaker.awayOdds}
        />
      ))}
    </div>
  )
}
