import { HistoryRow } from "@/components/history-row"

const historyData = [
  {
    date: "26/04",
    banca: "R$ 120,00",
    meta: "R$ 300,00",
    stopLoss: "R$ 20,00",
    status: "Fechada" as const,
    bets: [
      { name: "C. Vinicius marcar", odd: "2,00", value: "10" },
    ],
  },
  {
    date: "21/04",
    banca: "R$ 100,00",
    meta: "R$ 150,00",
    stopLoss: "R$ 50,00",
    status: "Red" as const,
    bets: [
      { name: "Inter ou empate", odd: "3,87", value: "3" },
    ],
  },
  {
    date: "20/04",
    banca: "R$ 70,00",
    meta: "R$ 250,00",
    stopLoss: "R$ 10,00",
    status: "Green" as const,
    bets: [
      { name: "Multipla: Grenal", odd: "3,00", value: "20" },
      { name: "Inter -0,5 gols" },
      { name: "Gremio -5,5 cartoes" },
    ],
  },
]

export function HistoryTable() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-6 py-3 px-4 border-b border-border text-xs uppercase font-light text-muted-foreground">
        <span>Data</span>
        <span>Banca</span>
        <span>Meta</span>
        <span>Stop Loss</span>
        <span>Status</span>
        <span className="text-center">Detalhes</span>
      </div>

      {/* Rows */}
      {historyData.map((item, index) => (
        <HistoryRow
          key={index}
          date={item.date}
          banca={item.banca}
          meta={item.meta}
          stopLoss={item.stopLoss}
          status={item.status}
          bets={item.bets}
        />
      ))}
    </div>
  )
}
