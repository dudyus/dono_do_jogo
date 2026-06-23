"use client"

import { useEffect, useState } from "react"
import { MatchCard } from "./match-card"
import { api, ApiError, type PartidaProxima } from "@/lib/api"
import { getUsuarioId } from "@/lib/auth"

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
    <div className="space-y-3">
      {partidas.map((p) => (
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
  )
}
