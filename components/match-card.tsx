import Link from "next/link"
import { formatarHorarioPartida } from "@/lib/utils"

interface MatchCardProps {
  id: number
  homeTeam: string
  awayTeam: string
  data: string | null
  betTip: string
  risco: string
}

const riscoCor: Record<string, string> = {
  BAIXO: "text-green-400 border-green-500/40 bg-green-500/10",
  MEDIO: "text-yellow-300 border-yellow-500/40 bg-yellow-500/10",
  ALTO: "text-red-400 border-red-500/40 bg-red-500/10",
}

export function MatchCard({ id, homeTeam, awayTeam, data, betTip, risco }: MatchCardProps) {
  return (
    <Link href={`/partida/${id}`} className="block">
      <div className="bg-card border border-border rounded-lg p-4 flex flex-row items-center gap-4 transition-colors cursor-pointer hover:border-primary/50">
        <div className="flex-1 flex flex-col gap-3">
          <TeamRow name={homeTeam} />
          <TeamRow name={awayTeam} />
        </div>

        <div className="flex items-center justify-center min-w-[80px]">
          <span className="text-foreground font-medium text-lg">{formatarHorarioPartida(data)}</span>
        </div>

        <div className="flex-1 flex flex-col items-end gap-2">
          <span className="text-yellow-300 text-xs">Melhor aposta da partida:</span>
          <div className="bg-primary/20 border border-primary text-primary px-4 py-2 rounded-md text-sm font-medium">
            {betTip}
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded border ${riscoCor[risco] ?? "text-muted-foreground border-border"}`}>
            Risco {risco}
          </span>
        </div>
      </div>
    </Link>
  )
}

function TeamRow({ name }: { name: string }) {
  const sigla = name.split(" ").map((p) => p[0]).join("").slice(0, 3).toUpperCase()
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold text-muted-foreground flex-shrink-0">
        {sigla}
      </div>
      <span className="text-foreground text-sm font-medium uppercase">{name}</span>
    </div>
  )
}
