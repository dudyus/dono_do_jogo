"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, X } from "lucide-react"
import { Header } from "@/components/header"
import { BackButton } from "@/components/back-button"
import { MobileNav } from "@/components/mobile-nav"
import { BancaSidebar } from "@/components/banca-sidebar"
import { CriarBancaScreen } from "@/components/criar-banca-screen"
import { MetaStopModal } from "@/components/meta-stop-modal"
import { ResultDropdown, type ResultType } from "@/components/result-dropdown"
import { getUsuarioId } from "@/lib/auth"
import { api, ApiError, type Aposta, type ApostaMultipla, type Banca, type BancaFlags } from "@/lib/api"

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
  const [multiplas, setMultiplas] = useState<ApostaMultipla[]>([])
  const [flags, setFlags] = useState<BancaFlags | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [metaStop, setMetaStop] = useState<"meta" | "stop" | null>(null)

  const [novaAposta, setNovaAposta] = useState({ tipo: "", odd: "", valor: "" })

  type ItemRascunho = { tipo: string; odd: string }
  const [novaMultipla, setNovaMultipla] = useState<{ itens: ItemRascunho[]; valor: string }>({
    itens: [{ tipo: "", odd: "" }],
    valor: "",
  })

  const carregarBanca = useCallback(async (uid: number) => {
    setCarregando(true)
    setErro("")
    try {
      const res = await api.bancaAtiva(uid)
      const ativa = res.banca && res.banca.status === "ATIVA" && res.banca.saldo_atual > 0
      setBanca(ativa ? res.banca : null)
      setApostas(ativa ? res.apostas ?? [] : [])
      setMultiplas(ativa ? res.multiplas ?? [] : [])
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
      setMultiplas([])
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

  const adicionarItemMultipla = () => {
    setNovaMultipla((prev) => ({ ...prev, itens: [...prev.itens, { tipo: "", odd: "" }] }))
  }

  const removerItemRascunho = (idx: number) => {
    setNovaMultipla((prev) => ({ ...prev, itens: prev.itens.filter((_, i) => i !== idx) }))
  }

  const atualizarItemRascunho = (idx: number, field: "tipo" | "odd", value: string) => {
    setNovaMultipla((prev) => {
      const itens = [...prev.itens]
      itens[idx] = { ...itens[idx], [field]: value }
      return { ...prev, itens }
    })
  }

  const oddAcumulada = novaMultipla.itens.reduce((acc, i) => {
    const o = Number(i.odd)
    return o > 1 ? acc * o : acc
  }, 1)

  const adicionarMultipla = async () => {
    if (!usuarioId || !banca) return
    const valor = Number(novaMultipla.valor)
    if (!valor || valor <= 0) return alert("Informe um valor válido")
    for (const item of novaMultipla.itens) {
      if (!item.tipo.trim()) return alert("Preencha todas as seleções")
      if (!Number(item.odd) || Number(item.odd) <= 1) return alert("Odd inválida em uma das seleções")
    }
    if (novaMultipla.itens.length < 2) return alert("Múltipla requer pelo menos 2 seleções")
    try {
      const res = await api.criarApostaMultipla({
        banca_id: banca.id,
        usuario_id: usuarioId,
        valor,
        itens: novaMultipla.itens.map((i) => ({ tipo_aposta: i.tipo.trim(), odd: Number(i.odd) })),
      })
      setMultiplas((prev) => [...prev, res.multipla])
      setBanca(res.banca)
      setNovaMultipla({ itens: [{ tipo: "", odd: "" }], valor: "" })
      aplicarFlags(res.flags)
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Falha ao criar múltipla")
    }
  }

  const removerItemMultipla = async (multiplaId: number, itemId: number) => {
    try {
      const res = await api.removerItemMultipla(multiplaId, itemId)
      setMultiplas((prev) => prev.map((m) => (m.id === multiplaId ? res.multipla : m)))
      setBanca(res.banca)
      aplicarFlags(res.flags)
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Falha ao remover seleção")
    }
  }

  const mudarResultadoMultipla = async (multiplaId: number, value: ResultType) => {
    try {
      const res = await api.resultadoApostaMultipla(multiplaId, RESULT_TO_API[value])
      setMultiplas((prev) => prev.map((m) => (m.id === multiplaId ? res.multipla : m)))
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

  const depositarBanca = async (valor: number) => {
    if (!banca) return
    const res = await api.depositarBanca(banca.id, valor)
    setBanca(res.banca)
  }

  const sacarBanca = async (valor: number) => {
    if (!banca) return
    const res = await api.sacarBanca(banca.id, valor)
    setBanca(res.banca)
  }

  const fecharBanca = async () => {
    if (!banca) return
    await api.fecharBanca(banca.id)
    router.push("/historico")
  }

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

      <main className="flex-1 p-8 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <BackButton />
          </div>

          {erro && <p className="text-sm text-destructive mb-4">{erro}</p>}

          {!banca ? (
            <CriarBancaScreen onCriar={criarBanca} zerada={flags?.zerada} />
          ) : (
            <div className="flex flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <p className="text-muted-foreground text-sm mb-6">
                  Banca aberta em{" "}
                  {banca.data_criacao
                    ? new Date(banca.data_criacao).toLocaleDateString("pt-BR")
                    : "-"}
                </p>

                {apostas.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Simples</p>
                    {apostas.map((aposta) => (
                      <div
                        key={aposta.id}
                        className="bg-muted/30 border border-border rounded-lg p-4 flex flex-row items-end gap-4"
                      >
                        <div className="flex-1 min-w-[180px]">
                          <span className="block text-xs text-primary mb-1">Aposta</span>
                          <div className="px-3 py-2 bg-card border border-border rounded text-sm text-foreground">
                            {aposta.tipo_aposta}
                          </div>
                        </div>
                        <div className="w-20">
                          <span className="block text-xs text-primary mb-1">ODD</span>
                          <div className="px-3 py-2 bg-card border border-border rounded text-sm text-foreground text-center">
                            {aposta.odd?.toFixed(2)}
                          </div>
                        </div>
                        <div className="w-20">
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
                )}

                {multiplas.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Múltiplas</p>
                    {multiplas.map((m) => (
                      <div key={m.id} className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
                        <div className="flex flex-wrap items-center gap-3 justify-between">
                          <div className="flex gap-4 text-sm">
                            <span className="text-muted-foreground">Odd acumulada: <strong className="text-foreground">{m.odd_total.toFixed(2)}</strong></span>
                            <span className="text-muted-foreground">Valor: <strong className="text-foreground">R$ {m.valor.toFixed(2)}</strong></span>
                          </div>
                          <ResultDropdown
                            value={apiToResult(m.resultado)}
                            onChange={(v) => mudarResultadoMultipla(m.id, v)}
                          />
                        </div>
                        <div className="space-y-2">
                          {m.itens.map((item) => (
                            <div key={item.id} className="flex items-center gap-2 text-sm">
                              <span className="flex-1 px-3 py-1.5 bg-card border border-border rounded text-foreground">{item.tipo_aposta}</span>
                              <span className="w-16 text-center px-2 py-1.5 bg-card border border-border rounded text-foreground">{item.odd.toFixed(2)}</span>
                              {m.resultado === "PENDENTE" && (
                                <button
                                  type="button"
                                  onClick={() => removerItemMultipla(m.id, item.id)}
                                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                                  title="Remover seleção"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-muted/20 border border-dashed border-border rounded-lg p-4 mt-6 space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nova Aposta Simples</p>
                  <div className="flex flex-row items-end gap-3">
                    <div className="flex-1 min-w-[180px]">
                      <label className="block text-xs text-primary mb-1">Aposta</label>
                      <input
                        value={novaAposta.tipo}
                        onChange={(e) => setNovaAposta({ ...novaAposta, tipo: e.target.value })}
                        placeholder="Ex: Flamengo vence"
                        className="w-full px-3 py-2 bg-card border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="w-20">
                      <label className="block text-xs text-primary mb-1">ODD</label>
                      <input
                        type="number"
                        value={novaAposta.odd}
                        onChange={(e) => setNovaAposta({ ...novaAposta, odd: e.target.value })}
                        className="no-spinner w-full px-3 py-2 bg-card border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="w-20">
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

                <div className="bg-muted/20 border border-dashed border-border rounded-lg p-4 mt-6 space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nova Múltipla</p>
                  {novaMultipla.itens.map((item, idx) => (
                    <div key={idx} className="flex flex-row items-end gap-2">
                      <div className="flex-1">
                        {idx === 0 && <label className="block text-xs text-primary mb-1">Seleção</label>}
                        <input
                          value={item.tipo}
                          onChange={(e) => atualizarItemRascunho(idx, "tipo", e.target.value)}
                          placeholder={`Seleção ${idx + 1}`}
                          className="w-full px-3 py-2 bg-card border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div className="w-20">
                        {idx === 0 && <label className="block text-xs text-primary mb-1">ODD</label>}
                        <input
                          type="number"
                          value={item.odd}
                          onChange={(e) => atualizarItemRascunho(idx, "odd", e.target.value)}
                          className="no-spinner w-full px-3 py-2 bg-card border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      {novaMultipla.itens.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removerItemRascunho(idx)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={adicionarItemMultipla}
                    className="text-xs text-primary underline"
                  >
                    + Adicionar seleção
                  </button>

                  {novaMultipla.itens.length >= 2 && oddAcumulada > 1 && (
                    <p className="text-xs text-muted-foreground">
                      Odd acumulada: <strong className="text-foreground">{oddAcumulada.toFixed(2)}</strong>
                    </p>
                  )}

                  <div className="flex flex-row items-end gap-3 pt-1">
                    <div className="w-28">
                      <label className="block text-xs text-primary mb-1">Valor (R$)</label>
                      <input
                        type="number"
                        value={novaMultipla.valor}
                        onChange={(e) => setNovaMultipla((prev) => ({ ...prev, valor: e.target.value }))}
                        className="no-spinner w-full px-3 py-2 bg-card border border-border rounded text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={adicionarMultipla}
                      className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Criar Múltipla
                    </button>
                  </div>
                </div>
              </div>

              <div className="ml-8">
                <BancaSidebar
                  banca={banca}
                  onEditar={editarBanca}
                  onDepositar={depositarBanca}
                  onSacar={sacarBanca}
                  onFechar={fecharBanca}
                />
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
