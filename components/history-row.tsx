"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { RESULTADO_LABEL, RESULTADO_COR } from "@/lib/utils"

interface BetDetail {
  name: string
  odd?: string
  value?: string
  resultado: string
}

interface MultiplaDetail {
  oddTotal: string
  valor: string
  resultado: string
  itens: { name: string; odd: string; resultado: string }[]
}

interface HistoryRowProps {
  date: string
  bancaInicial: string
  bancaFinal: string
  meta: string
  stopLoss: string
  status: "Fechada" | "Red" | "Green"
  bets?: BetDetail[]
  multiplas?: MultiplaDetail[]
}

function ResultadoBadge({ resultado }: { resultado: string }) {
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded ${RESULTADO_COR[resultado] ?? "bg-muted text-muted-foreground"}`}>
      {RESULTADO_LABEL[resultado] ?? resultado}
    </span>
  )
}

export function HistoryRow({ date, bancaInicial, bancaFinal, meta, stopLoss, status, bets, multiplas }: HistoryRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const statusColor = {
    Fechada: "text-yellow-300",
    Red: "text-red-500",
    Green: "text-green-500",
  }

  return (
    <div className="border-b border-border">
      <div className="grid grid-cols-7 py-4 px-4 items-center text-sm">
        <span className="text-foreground">{date}</span>
        <span className="text-foreground">{bancaInicial}</span>
        <span className="text-foreground">{bancaFinal}</span>
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
        <div className="px-4 pb-4 space-y-3">
          <div className="bg-card border border-border rounded-lg p-4">
            {(!bets || bets.length === 0) && (!multiplas || multiplas.length === 0) ? (
              <p className="text-sm text-muted-foreground">Nenhuma aposta registrada.</p>
            ) : (
              <>
                {bets && bets.length > 0 && (
                  <div className={multiplas && multiplas.length > 0 ? "mb-4" : ""}>
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <span className="text-xs text-primary">Aposta</span>
                      <span className="text-xs text-primary">ODD</span>
                      <span className="text-xs text-primary">Valor</span>
                      <span className="text-xs text-primary">Resultado</span>
                    </div>

                    {bets.map((bet, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4 items-center mb-2">
                        <div className="bg-muted rounded px-3 py-2 text-sm text-foreground">
                          {bet.name}
                        </div>
                        <div className="bg-muted rounded px-3 py-2 text-sm text-foreground text-center">
                          {bet.odd ?? "-"}
                        </div>
                        <div className="bg-muted rounded px-3 py-2 text-sm text-foreground text-center">
                          {bet.value ?? "-"}
                        </div>
                        <div className="flex justify-center">
                          <ResultadoBadge resultado={bet.resultado} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {multiplas && multiplas.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs text-primary">Múltiplas</p>
                    {multiplas.map((m, index) => (
                      <div key={index} className="border border-border rounded-lg p-3 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs text-muted-foreground">
                            Odd {m.oddTotal} · Valor R$ {m.valor}
                          </span>
                          <ResultadoBadge resultado={m.resultado} />
                        </div>
                        <div className="space-y-1.5">
                          {m.itens.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <span className="flex-1 px-3 py-1.5 bg-muted rounded text-foreground">{item.name}</span>
                              <span className="w-16 text-center px-2 py-1.5 bg-muted rounded text-foreground">{item.odd}</span>
                              <ResultadoBadge resultado={item.resultado} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
