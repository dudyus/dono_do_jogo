"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Header } from "@/components/header"
import { BackButton } from "@/components/back-button"
import { MobileNav } from "@/components/mobile-nav"
import { BancaSidebar } from "@/components/banca-sidebar"
import { CriarBancaScreen } from "@/components/criar-banca-screen"
import { MetaStopModal } from "@/components/meta-stop-modal"
import { ResultDropdown, type ResultType } from "@/components/result-dropdown"
import { getUsuarioId } from "@/lib/auth"
import { api, ApiError, type Aposta, type Banca, type BancaFlags } from "@/lib/api"

const RESULT_TO_API = {
  "em-andamento": "PENDENTE",
  green: "GANHA",
  red: "PERDIDA",
} as const

function apiToResult(r: Aposta["resultado"]): ResultType {
  if (r === "GANHA") return "green"
  if (r === "PERDIDA") return "red"
  return "em-andamento"
}

export default function BancaPage() {
  const router = useRouter()
  const [usuarioId, setUsuarioId] = useState<number | null>(null)
  const [banca, setBanca] = useState<Banca | null>(null)
  const [apostas, setApostas] = useState<Aposta[]>([])
  const [flags, setFlags] = useState<BancaFlags | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [metaStop, setMetaStop] = useState<"meta" | "stop" | null>(null)

  // form de nova aposta
  const [novaAposta, setNovaAposta] = useState({ tipo: "", odd: "", valor: "" })

  const carregarBanca = useCallback(async (uid: number) => {
    setCarregando(true)
    setErro("")
    try {
      const res = await api.bancaAtiva(uid)
      const ativa = res.banca && res.banca.status === "ATIVA" && res.banca.saldo_atual > 0
      setBanca(ativa ? res.banca : null)
      setApostas(ativa ? res.apostas ?? [] : [])
      setFlags(res.flags ?? null)
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Falha ao conectar à API")
      setBanca(null)
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    const uid = getUsuarioId()
    if (!uid) {
      router.push("/login")
      return
    }
    setUsuarioId(uid)
    carregarBanca(uid)
  }, [router, carregarBanca])

  const aplicarFlags = (f: BancaFlags | undefined) => {
    if (!f) return
    setFlags(f)
    if (f.atingiu_meta) setMetaStop("meta")
    else if (f.atingiu_stop) setMetaStop("stop")
  }

  const criarBanca = async (saldo: number, stopLoss: number, meta: number) => {
    if (!usuarioId) return
    try {
      const res = await api.criarBanca({
        usuario_id: usuarioId,
        saldo_inicial: saldo,
        stop_loss: stopLoss,
        meta_diaria: meta,
      })
      setBanca(res.banca)
      setApostas([])
      setFlags(res.flags)
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Falha ao criar banca")
    }
  }

  const adicionarAposta = async () => {
    if (!usuarioId || !banca) return
    const odd = Number(novaAposta.odd)
    const valor = Number(novaAposta.valor)
    if (!novaAposta.tipo.trim()) return alert("Informe a aposta")
    if (!odd || odd <= 1) return alert("Informe uma odd válida")
    if (!valor || valor <= 0) return alert("Informe um valor válido")
    try {
      const res = await api.criarAposta({
        banca_id: banca.id,
        usuario_id: usuarioId,
        tipo_aposta: novaAposta.tipo.trim(),
        odd,
        valor,
      })
      setApostas((prev) => [...prev, res.aposta])
      setBanca(res.banca)
      setNovaAposta({ tipo: "", odd: "", valor: "" })
      aplicarFlags(res.flags)
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Falha ao criar aposta")
    }
  }

  const mudarResultado = async (apostaId: number, value: ResultType) => {
    try {
      const res = await api.resultadoAposta(apostaId, RESULT_TO_API[value])
      setApostas((prev) => prev.map((a) => (a.id === apostaId ? res.aposta : a)))
      setBanca(res.banca)
      aplicarFlags(res.flags)
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Falha ao atualizar resultado")
    }
  }

  const editarBanca = async (meta: number, stopLoss: number) => {
    if (!banca) return
    const res = await api.editarBanca(banca.id, { meta_diaria: meta, stop_loss: stopLoss })
    setBanca(res.banca)
    setFlags(res.flags)
  }

  const fecharBanca = async () => {
    if (!banca) return
    await api.fecharBanca(banca.id)
    router.push("/historico")
  }

  // ---------- render ----------

  if (carregando) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center text-muted-foreground">
          Carregando...
        </main>
        <MobileNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <BackButton />
          </div>

          {erro && <p className="text-sm text-destructive mb-4">{erro}</p>}

          {!banca ? (
            <CriarBancaScreen onCriar={criarBanca} zerada={flags?.zerada} />
          ) : (
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
              <div className="flex-1">
                <p className="text-muted-foreground text-sm mb-6">
                  Banca aberta em{" "}
                  {banca.data_criacao
                    ? new Date(banca.data_criacao).toLocaleDateString("pt-BR")
                    : "-"}
                </p>

                <div className="space-y-4">
                  {apostas.map((aposta) => (
                    <div
                      key={aposta.id}
                      className="bg-muted/30 border border-border rounded-lg p-4 flex flex-col lg:flex-row lg:items-end gap-4"
                    >
                      <div className="flex-1 min-w-[180px]">
                        <span className="block text-xs text-primary mb-1">Aposta</span>
                        <div className="px-3 py-2 bg-card border border-border rounded text-sm text-foreground">
                          {aposta.tipo_aposta}
                        </div>
                      </div>
                      <div className="w-full lg:w-20">
                        <span className="block text-xs text-primary mb-1">ODD</span>
                        <div className="px-3 py-2 bg-card border border-border rounded text-sm text-foreground text-center">
                          {aposta.odd?.toFixed(2)}
                        </div>
                      </div>
                      <div className="w-full lg:w-20">
                        <span className="block text-xs text-primary mb-1">Valor</span>
                        <div className="px-3 py-2 bg-card border border-border rounded text-sm text-foreground text-center">
                          {aposta.valor?.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <span className="block text-xs text-primary mb-1">Resultado</span>
                        <ResultDropdown
                          value={apiToResult(aposta.resultado)}
                          onChange={(v) => mudarResultado(aposta.id, v)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* nova aposta */}
                <div className="bg-muted/20 border border-dashed border-border rounded-lg p-4 mt-4 flex flex-col lg:flex-row lg:items-end gap-3">
                  <div className="flex-1 min-w-[180px]">
                    <label className="block text-xs text-primary mb-1">Aposta</label>
                    <input
                      value={novaAposta.tipo}
                      onChange={(e) => setNovaAposta({ ...novaAposta, tipo: e.target.value })}
                      placeholder="Ex: Flamengo vence"
                      className="w-full px-3 py-2 bg-card border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="w-full lg:w-20">
                    <label className="block text-xs text-primary mb-1">ODD</label>
                    <input
                      type="number"
                      value={novaAposta.odd}
                      onChange={(e) => setNovaAposta({ ...novaAposta, odd: e.target.value })}
                      className="no-spinner w-full px-3 py-2 bg-card border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="w-full lg:w-20">
                    <label className="block text-xs text-primary mb-1">Valor</label>
                    <input
                      type="number"
                      value={novaAposta.valor}
                      onChange={(e) => setNovaAposta({ ...novaAposta, valor: e.target.value })}
                      className="no-spinner w-full px-3 py-2 bg-card border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={adicionarAposta}
                    className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>
              </div>

              <div className="lg:ml-8">
                <BancaSidebar banca={banca} onEditar={editarBanca} onFechar={fecharBanca} />
              </div>
            </div>
          )}
        </div>
      </main>

      {metaStop && (
        <MetaStopModal
          tipo={metaStop}
          onFechar={() => {
            setMetaStop(null)
            fecharBanca()
          }}
          onContinuar={() => setMetaStop(null)}
        />
      )}

      <MobileNav />
    </div>
  )
}
