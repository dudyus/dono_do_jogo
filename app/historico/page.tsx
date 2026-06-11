"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { BackButton } from "@/components/back-button"
import { HistoryTable, type HistoryItem } from "@/components/history-table"
import { getUsuarioId } from "@/lib/auth"
import { api, ApiError } from "@/lib/api"

function brl(v: number | null) {
  return (v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function dataCurta(iso: string | null) {
  if (!iso) return "-"
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`
}

export default function HistoricoPage() {
  const router = useRouter()
  const [items, setItems] = useState<HistoryItem[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    const uid = getUsuarioId()
    if (!uid) {
      router.push("/login")
      return
    }
    api
      .historicoBancas(uid)
      .then((res) => {
        setItems(
          res.historico.map((b) => ({
            date: dataCurta(b.data_fechamento ?? b.data_criacao),
            banca: brl(b.saldo_atual),
            meta: brl(b.meta_diaria),
            stopLoss: brl(b.stop_loss),
            status: b.resultado_final as HistoryItem["status"],
            bets: b.apostas.map((a) => ({
              name: a.tipo_aposta,
              odd: a.odd != null ? a.odd.toFixed(2).replace(".", ",") : undefined,
              value: a.valor != null ? a.valor.toFixed(2) : undefined,
            })),
          }))
        )
      })
      .catch((err) =>
        setErro(err instanceof ApiError ? err.message : "Falha ao conectar à API")
      )
      .finally(() => setCarregando(false))
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 py-6 md:px-8 pb-24 md:pb-8">
        <BackButton />

        <div className="max-w-4xl mx-auto mt-4">
          {erro && <p className="text-sm text-destructive mb-4">{erro}</p>}
          {carregando ? (
            <p className="text-muted-foreground text-sm">Carregando...</p>
          ) : (
            <HistoryTable items={items} />
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
