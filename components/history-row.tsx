"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface BetDetail {
  name: string
  odd?: string
  value?: string
}

interface HistoryRowProps {
  date: string
  banca: string
  meta: string
  stopLoss: string
  status: "Fechada" | "Red" | "Green"
  bets?: BetDetail[]
}

export function HistoryRow({ date, banca, meta, stopLoss, status, bets }: HistoryRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const statusColor = {
    Fechada: "text-yellow-300",
    Red: "text-red-500",
    Green: "text-green-500",
  }

  return (
    <div className="border-b border-border">
      <div className="grid grid-cols-6 py-4 px-4 items-center text-sm">
        <span className="text-foreground">{date}</span>
        <span className="text-foreground">{banca}</span>
        <span className="text-foreground">{meta}</span>
        <span className="text-foreground">{stopLoss}</span>
        <span className={statusColor[status]}>{status}</span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex justify-center text-primary hover:text-primary/80 transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="bg-card border border-border rounded-lg p-4">
            {!bets || bets.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma aposta registrada.</p>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <span className="text-xs text-primary">Aposta</span>
                  <span className="text-xs text-primary">ODD</span>
                  <span className="text-xs text-primary">Valor</span>
                </div>

                {bets.map((bet, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-center mb-2">
                    <div className="bg-muted rounded px-3 py-2 text-sm text-foreground">
                      {bet.name}
                    </div>
                    <div className="bg-muted rounded px-3 py-2 text-sm text-foreground text-center">
                      {bet.odd ?? "-"}
                    </div>
                    <div className="bg-muted rounded px-3 py-2 text-sm text-foreground text-center">
                      {bet.value ?? "-"}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
