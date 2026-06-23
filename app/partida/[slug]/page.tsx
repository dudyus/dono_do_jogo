"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { BackButton } from "@/components/back-button"
import { api, ApiError, type OddItem, type Recomendacao } from "@/lib/api"
import { getUsuarioId } from "@/lib/auth"

interface MatchPageProps {
  params: Promise<{ slug: string }>
}

function hora(iso: string | null) {
  if (!iso) return "--:--"
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

const riscoCor: Record<string, string> = {
  BAIXO: "text-green-400",
  MEDIO: "text-yellow-300",
  ALTO: "text-red-400",
}

export default function MatchPage({ params }: MatchPageProps) {
  const { slug } = use(params)
  const partidaId = Number(slug)

  const [rec, setRec] = useState<Recomendacao | null>(null)
  const [partida, setPartida] = useState<{ time_casa: string; time_fora: string; data: string | null } | null>(null)
  const [odds, setOdds] = useState<OddItem[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    if (!partidaId || Number.isNaN(partidaId)) {
      setErro("Partida inválida")
      setCarregando(false)
      return
    }
    Promise.all([api.oddsPartida(partidaId), api.recomendacao(partidaId, getUsuarioId())])
      .then(([o, r]) => {
        setOdds(o.odds)
        setPartida({ time_casa: o.partida.time_casa, time_fora: o.partida.time_fora, data: o.partida.data })
        setRec(r)
      })
      .catch((err) =>
        setErro(err instanceof ApiError ? err.message : "Falha ao conectar à API")
      )
      .finally(() => setCarregando(false))
  }, [partidaId])

  const h2h = odds.filter((o) => o.mercado === "h2h")
  const gols = odds.filter((o) => o.mercado === "gols")

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-8 py-8 max-w-4xl mx-auto pb-8">
        <div className="flex items-center gap-4 mb-4">
          <BackButton />
        </div>

        {carregando && <p className="text-muted-foreground text-sm">Carregando...</p>}
        {erro && <p className="text-destructive text-sm">{erro}</p>}

        {!carregando && !erro && partida && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-center gap-10">
                <span className="text-foreground font-semibold text-lg uppercase text-right flex-1">
                  {partida.time_casa}
                </span>
                <div className="flex flex-col items-center">
                  <span className="text-primary font-bold text-3xl">X</span>
                  <span className="text-muted-foreground text-sm">{hora(partida.data)}</span>
                </div>
                <span className="text-foreground font-semibold text-lg uppercase text-left flex-1">
                  {partida.time_fora}
                </span>
              </div>
            </div>

            {rec?.melhor_aposta && (
              <div className="bg-primary/10 border border-primary rounded-lg p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-yellow-300 text-xs uppercase">Melhor aposta (análise)</span>
                  <span className={`text-xs font-medium ${riscoCor[rec.risco] ?? "text-muted-foreground"}`}>
                    Risco {rec.risco}
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-primary text-lg font-semibold">
                    {rec.melhor_aposta.rotulo}
                  </span>
                  <span className="text-foreground text-sm">
                    odd {rec.melhor_aposta.odd.toFixed(2)} · {rec.melhor_aposta.casa_aposta}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{rec.justificativa}</p>
                <div className="text-xs text-muted-foreground mt-3">
                  Gols esperados: {rec.gols_esperados.casa.toFixed(2)} x {rec.gols_esperados.fora.toFixed(2)}{" "}
                  (total {rec.gols_esperados.total.toFixed(2)})
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <OddsBloco titulo="Resultado (1x2)" itens={h2h} />
              <OddsBloco titulo="Total de gols" itens={gols} />
            </div>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  )
}

function OddsBloco({ titulo, itens }: { titulo: string; itens: OddItem[] }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-foreground font-medium text-sm mb-1 text-center">{titulo}</h3>
      {itens[0] && (
        <p className="text-[11px] text-muted-foreground text-center mb-3">{itens[0].casa_aposta}</p>
      )}
      <div className="space-y-2">
        {itens.map((o) => (
          <div key={o.tipo_aposta} className="flex items-center justify-between text-sm">
            <span className="text-primary">{o.selecao}</span>
            <span className="text-foreground">{o.odd.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
