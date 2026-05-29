"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Header } from "@/components/header"
import { BackButton } from "@/components/back-button"
import { MobileNav } from "@/components/mobile-nav"
import { BetEntry } from "@/components/bet-entry"
import { BancaSidebar } from "@/components/banca-sidebar"
import type { ResultType } from "@/components/result-dropdown"

interface SubBet {
  id: string
  name: string
}

interface Bet {
  id: string
  aposta: string
  odd: string
  valor: string
  resultado: ResultType
  subBets: SubBet[]
}

const initialBets: Bet[] = [
  {
    id: "1",
    aposta: "C. Vinicius marcar",
    odd: "2.00",
    valor: "10",
    resultado: "em-andamento",
    subBets: [],
  },
  {
    id: "2",
    aposta: "Multipla: Grenal",
    odd: "21.0",
    valor: "30",
    resultado: "green",
    subBets: [{ id: "2-1", name: "Gremio +10.5 gols 1ºT" }],
  },
  {
    id: "3",
    aposta: "Inter ou empate",
    odd: "3.87",
    valor: "3",
    resultado: "red",
    subBets: [],
  },
]

export default function BancaPage() {
  const [bets, setBets] = useState<Bet[]>(initialBets)

  const addBet = () => {
    const newBet: Bet = {
      id: crypto.randomUUID(),
      aposta: "",
      odd: "",
      valor: "",
      resultado: "em-andamento",
      subBets: [],
    }
    setBets([...bets, newBet])
  }

  const updateBet = (id: string, field: string, value: string | ResultType | SubBet[]) => {
    setBets(
      bets.map((bet) =>
        bet.id === id ? { ...bet, [field]: value } : bet
      )
    )
  }

  const deleteBet = (id: string) => {
    setBets(bets.filter((bet) => bet.id !== id))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <BackButton />
          </div>

          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm mb-6">Domingo, 26/04</p>

              <div className="space-y-4">
                {bets.map((bet) => (
                  <BetEntry
                    key={bet.id}
                    id={bet.id}
                    aposta={bet.aposta}
                    odd={bet.odd}
                    valor={bet.valor}
                    resultado={bet.resultado}
                    subBets={bet.subBets}
                    onUpdate={updateBet}
                    onDelete={deleteBet}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={addBet}
                className="flex items-center gap-2 mt-6 text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Adicionar aposta</span>
              </button>
            </div>

            <div className="lg:ml-8">
              <BancaSidebar balance={120} />
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
