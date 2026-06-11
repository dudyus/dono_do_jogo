interface OddsCardProps {
  bookmaker: string
  homeTeamShort: string
  awayTeamShort: string
  homeOdds: number
  drawOdds: number
  awayOdds: number
}

export function OddsCard({
  bookmaker,
  homeTeamShort,
  awayTeamShort,
  homeOdds,
  drawOdds,
  awayOdds,
}: OddsCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-foreground font-medium text-sm mb-4 text-center">{bookmaker}</h3>
      <div className="space-y-2">
        <OddsRow label={homeTeamShort} value={homeOdds} />
        <OddsRow label="X" value={drawOdds} />
        <OddsRow label={awayTeamShort} value={awayOdds} />
      </div>
    </div>
  )
}

function OddsRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-primary">{label}</span>
      <span className="text-foreground">{value.toFixed(2)}</span>
    </div>
  )
}
