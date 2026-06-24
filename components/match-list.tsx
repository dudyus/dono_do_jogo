"use client"

import { useEffect, useState } from "react"
import { MatchCard } from "./match-card"
import { api, ApiError, type PartidaProxima } from "@/lib/api"
import { getUsuarioId } from "@/lib/auth"
import { chaveDataPartida, formatarDataPartida } from "@/lib/utils"

function agruparPorDia(partidas: PartidaProxima[]) {
  const grupos: { chave: string; data: string | null; partidas: PartidaProxima[] }[] = []

  for (const p of partidas) {
    const chave = chaveDataPartida(p.data)
    const grupoAtual = grupos[grupos.length - 1]
    if (grupoAtual && grupoAtual.chave === chave) {
      grupoAtual.partidas.push(p)
    } else {
      grupos.push({ chave, data: p.data, partidas: [p] })
    }
  }

  return grupos
}

export function MatchList() {
  const [partidas, setPartidas] = useState<PartidaProxima[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    api
      .partidasProximas(10, getUsuarioId())
      .then((res) => setPartidas(res.partidas))
      .catch((err) =>
        setErro(err instanceof ApiError ? err.message : "Falha ao conectar à API")
      )
      .finally(() => setCarregando(false))
  }, [])

  if (carregando) {
    return <p className="text-muted-foreground text-sm">Carregando partidas...</p>
  }
  if (erro) {
    return <p className="text-destructive text-sm">{erro}</p>
  }
  if (partidas.length === 0) {
    return <p className="text-muted-foreground text-sm">Nenhuma partida próxima.</p>
  }

  return (
    <div className="space-y-6">
      {agruparPorDia(partidas).map((grupo) => (
        <div key={grupo.chave}>
          <div className="text-left text-sm font-semibold text-foreground mb-3">
            {formatarDataPartida(grupo.data)}
          </div>
          <div className="space-y-3">
            {grupo.partidas.map((p) => (
              <MatchCard
                key={p.id}
                id={p.id}
                homeTeam={p.time_casa}
                awayTeam={p.time_fora}
                data={p.data}
                betTip={p.melhor_aposta?.rotulo ?? "Sem recomendação"}
                risco={p.risco}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
