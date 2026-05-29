"use client"

import { FeaturedBetCard } from "./featured-bet-card"

const featuredBets = [
  {
    odds: "1.42",
    title: "+0.5 impedimentos para o Gremio",
    description: "Gremio teve mais de 0.5 impedimentos em todos os jogos do brasileirao em 2026",
  },
  {
    odds: "1.24",
    title: "+7.5 escanteios na partida",
    description: "Media de escanteios do Gremio como mandante e de 5.2, enquanto o Coritiba tem media de 4 como visitante",
  },
  {
    odds: "2.00",
    title: "Carlos Vinicius marcar a qualquer momento",
    description: "Carlos Vinicius tem 7 gols no campeonato, 4 deles em casa",
  },
  {
    odds: "1.25",
    title: "Coritiba -1.5 gols",
    description: "Gremio sofreu 2 ou mais gols 4 vezes nos ultimos 16 jogos do brasileirao como mandante",
  },
  {
    odds: "1.37",
    title: "P. Morisco 3+ defesas",
    description: "Goleiros adversarios do Gremio fizeram 3+ defesas em todos os jogos",
  },
  {
    odds: "1.85",
    title: "+1.5 faltas para Nardoni",
    description: "Nardoni fez 1.5+ faltas em 3 dos ultimos 5 jogos do Gremio",
  },
  {
    odds: "1.78",
    title: "Carlos Vinicius 1+ chute a gol no primeiro tempo",
    description: "Carlos Vinicius tem a media de 1 chute a gol no primeiro tempo com Gremio como mandante",
  },
  {
    odds: "1.24",
    title: "Gremio ou empate",
    description: "Gremio perdeu 2 dos ultimos 20 jogos como mandante contra o Coritiba",
  },
  {
    odds: "1.32",
    title: "Gremio para marcar em ambos os tempos",
    description: "Gremio marcou apenas 2 vezes em ambos os tempos nas ultimas 12 partidas do brasileirao",
  },
]

export function FeaturedBetsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {featuredBets.map((bet, index) => (
        <FeaturedBetCard
          key={index}
          odds={bet.odds}
          title={bet.title}
          description={bet.description}
        />
      ))}
    </div>
  )
}
