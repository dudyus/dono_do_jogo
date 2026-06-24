import { HistoryRow } from "@/components/history-row"

export interface HistoryItem {
  date: string
  bancaInicial: string
  bancaFinal: string
  meta: string
  stopLoss: string
  status: "Fechada" | "Red" | "Green"
  bets: { name: string; odd?: string; value?: string }[]
}

export function HistoryTable({ items }: { items: HistoryItem[] }) {
  if (items.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm">
        Nenhuma banca fechada ainda.
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="grid grid-cols-7 py-3 px-4 border-b border-border text-xs uppercase font-light text-muted-foreground">
        <span>Data</span>
        <span>Banca Inicial</span>
        <span>Banca Final</span>
        <span>Meta</span>
        <span>Stop Loss</span>
        <span>Status</span>
        <span className="text-center">Detalhes</span>
      </div>

      {items.map((item, index) => (
        <HistoryRow
          key={index}
          date={item.date}
          bancaInicial={item.bancaInicial}
          bancaFinal={item.bancaFinal}
          meta={item.meta}
          stopLoss={item.stopLoss}
          status={item.status}
          bets={item.bets}
        />
      ))}
    </div>
  )
}
