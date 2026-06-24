"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { BackButton } from "@/components/back-button"
import { HistoryTable, type HistoryItem } from "@/components/history-table"
import { getUsuarioId } from "@/lib/auth"
import { api, ApiError } from "@/lib/api"

const ITENS_POR_PAGINA = 10

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

function brl(v: number | null) {
  return (v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function dataCurta(iso: string | null) {
  if (!iso) return "-"
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`
}

function mesAnoChave(iso: string | null): string {
  if (!iso) return "sem-data"
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

function mesAnoLabel(chave: string): string {
  if (chave === "sem-data") return "Sem data"
  const [ano, mes] = chave.split("-")
  return `${MESES[parseInt(mes) - 1]} ${ano}`
}

interface ItemFull extends HistoryItem {
  mesAno: string
}

export default function HistoricoPage() {
  const router = useRouter()
  const [todos, setTodos] = useState<ItemFull[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [mesFiltro, setMesFiltro] = useState<string>("todos")
  const [pagina, setPagina] = useState(1)

  useEffect(() => {
    const uid = getUsuarioId()
    if (!uid) {
      router.push("/login")
      return
    }
    api
      .historicoBancas(uid)
      .then((res) => {
        setTodos(
          res.historico.map((b) => ({
            date: dataCurta(b.data_fechamento ?? b.data_criacao),
            bancaInicial: brl(b.saldo_inicial),
            bancaFinal: brl(b.saldo_atual),
            meta: brl(b.meta_diaria),
            stopLoss: brl(b.stop_loss),
            status: b.resultado_final as HistoryItem["status"],
            bets: b.apostas.map((a) => ({
              name: a.tipo_aposta,
              odd: a.odd != null ? a.odd.toFixed(2).replace(".", ",") : undefined,
              value: a.valor != null ? a.valor.toFixed(2) : undefined,
            })),
            mesAno: mesAnoChave(b.data_fechamento ?? b.data_criacao),
          }))
        )
      })
      .catch((err) =>
        setErro(err instanceof ApiError ? err.message : "Falha ao conectar à API")
      )
      .finally(() => setCarregando(false))
  }, [router])

  const mesesDisponiveis = useMemo(() => {
    const set = new Set(todos.map((i) => i.mesAno))
    return Array.from(set).sort((a, b) => b.localeCompare(a))
  }, [todos])

  const itensFiltrados = useMemo(() => {
    if (mesFiltro === "todos") return todos
    return todos.filter((i) => i.mesAno === mesFiltro)
  }, [todos, mesFiltro])

  const totalPaginas = Math.max(1, Math.ceil(itensFiltrados.length / ITENS_POR_PAGINA))
  const itensPagina = itensFiltrados.slice(
    (pagina - 1) * ITENS_POR_PAGINA,
    pagina * ITENS_POR_PAGINA
  )

  const mudarFiltro = (mes: string) => {
    setMesFiltro(mes)
    setPagina(1)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-8 py-6 pb-8">
        <BackButton />

        <div className="max-w-4xl mx-auto mt-4">
          {erro && <p className="text-sm text-destructive mb-4">{erro}</p>}
          {carregando ? (
            <p className="text-muted-foreground text-sm">Carregando...</p>
          ) : (
            <>
              {mesesDisponiveis.length > 0 && (
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="text-xs text-muted-foreground mr-1">Mês:</span>
                  <button
                    onClick={() => mudarFiltro("todos")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      mesFiltro === "todos"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Todos
                  </button>
                  {mesesDisponiveis.map((m) => (
                    <button
                      key={m}
                      onClick={() => mudarFiltro(m)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        mesFiltro === m
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {mesAnoLabel(m)}
                    </button>
                  ))}
                </div>
              )}

              <HistoryTable items={itensPagina} />

              {totalPaginas > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    onClick={() => setPagina((p) => Math.max(1, p - 1))}
                    disabled={pagina === 1}
                    className="px-3 py-1.5 rounded-md text-sm font-medium bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
                  >
                    ← Anterior
                  </button>
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPagina(p)}
                      className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                        p === pagina
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                    disabled={pagina === totalPaginas}
                    className="px-3 py-1.5 rounded-md text-sm font-medium bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
                  >
                    Próxima →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
