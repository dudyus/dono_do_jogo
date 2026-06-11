"use client"

import { useState } from "react"
import type { Banca } from "@/lib/api"

interface BancaSidebarProps {
  banca: Banca
  onEditar: (meta: number, stopLoss: number) => Promise<void> | void
  onDepositar: (valor: number) => Promise<void>
  onSacar: (valor: number) => Promise<void>
  onFechar: () => void
}

function brl(v: number | null) {
  return (v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

type ModalAtivo = "editar" | "depositar" | "sacar" | null

export function BancaSidebar({ banca, onEditar, onDepositar, onSacar, onFechar }: BancaSidebarProps) {
  const [modalAtivo, setModalAtivo] = useState<ModalAtivo>(null)
  const [meta, setMeta] = useState(banca.meta_diaria ?? 0)
  const [stopLoss, setStopLoss] = useState(banca.stop_loss ?? 0)
  const [valorMovimento, setValorMovimento] = useState("")
  const [erroMovimento, setErroMovimento] = useState("")
  const [carregando, setCarregando] = useState(false)

  const fecharModal = () => {
    setModalAtivo(null)
    setValorMovimento("")
    setErroMovimento("")
  }

  const salvarEdicao = async () => {
    if (meta <= 0) return alert("Meta deve ser maior que 0")
    if (stopLoss < 0) return alert("Stop loss não pode ser negativo")
    await onEditar(meta, stopLoss)
    fecharModal()
  }

  const confirmarMovimento = async () => {
    const valor = Number(valorMovimento)
    if (!valor || valor <= 0) { setErroMovimento("Informe um valor válido"); return }
    if (modalAtivo === "sacar" && valor > banca.saldo_atual) {
      setErroMovimento("Valor maior que o saldo disponível")
      return
    }
    setCarregando(true)
    setErroMovimento("")
    try {
      if (modalAtivo === "depositar") await onDepositar(valor)
      else if (modalAtivo === "sacar") await onSacar(valor)
      fecharModal()
    } catch {
      setErroMovimento("Erro ao processar operação")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <>
      <div className="flex flex-col items-end gap-3">
        <div className="text-right space-y-1">
          <div>
            <span className="text-muted-foreground text-sm">Banca </span>
            <span className="text-primary font-semibold text-lg">
              {brl(banca.saldo_atual)}
            </span>
          </div>
          {(() => {
            const perf = banca.saldo_atual - banca.saldo_referencia
            return (
              <div className={`text-xs font-medium ${perf > 0 ? "text-green-500" : perf < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                Performance: {perf >= 0 ? "+" : ""}{brl(perf)}
              </div>
            )
          })()}
          <div className="text-xs text-muted-foreground">
            Ganhar {brl(banca.meta_diaria)} · Perder máx {brl(banca.stop_loss)}
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full max-w-[160px]">
          <button
            onClick={() => { setValorMovimento(""); setErroMovimento(""); setModalAtivo("depositar") }}
            className="px-4 py-1.5 rounded-md text-sm font-medium bg-primary text-white transition-colors"
          >
            + Depositar
          </button>
          <button
            onClick={() => { setValorMovimento(""); setErroMovimento(""); setModalAtivo("sacar") }}
            className="px-4 py-1.5 rounded-md text-sm font-medium bg-primary text-white transition-colors"
          >
            − Sacar
          </button>
          <button
            onClick={() => setModalAtivo("editar")}
            className="px-4 py-1.5 rounded-md text-sm font-medium bg-primary text-primary-foreground"
          >
            Editar meta / stop
          </button>
          <button
            onClick={onFechar}
            className="px-4 py-1.5 rounded-md text-sm font-medium bg-destructive text-white"
          >
            Fechar banca
          </button>
        </div>
      </div>

      {/* Modal: Depositar / Sacar */}
      {(modalAtivo === "depositar" || modalAtivo === "sacar") && (
        <Modal onClose={fecharModal}>
          <h2 className="text-center text-primary font-semibold mb-1">
            {modalAtivo === "depositar" ? "Depositar na banca" : "Sacar da banca"}
          </h2>
          <p className="text-center text-xs text-muted-foreground mb-4">
            Saldo atual: {brl(banca.saldo_atual)}
          </p>
          <Input
            label="Valor (R$)"
            value={valorMovimento}
            onChange={(e) => setValorMovimento(e.target.value)}
          />
          {erroMovimento && (
            <p className="text-xs text-destructive mb-3 -mt-2">{erroMovimento}</p>
          )}
          <div className="flex gap-2">
            <button
              onClick={confirmarMovimento}
              disabled={carregando}
              className={`flex-1 py-2 rounded-md text-sm font-medium text-white transition-colors disabled:opacity-60 ${
                modalAtivo === "depositar"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {carregando ? "..." : "Confirmar"}
            </button>
            <button
              onClick={fecharModal}
              disabled={carregando}
              className="flex-1 bg-muted text-foreground py-2 rounded-md text-sm font-medium"
            >
              Cancelar
            </button>
          </div>
        </Modal>
      )}

      {/* Modal: Editar meta / stop */}
      {modalAtivo === "editar" && (
        <Modal onClose={fecharModal}>
          <h2 className="text-center text-primary font-semibold mb-4">
            Editar objetivos
          </h2>
          <Input label="Quero ganhar (R$)" value={meta} onChange={(e) => setMeta(Number(e.target.value))} />
          <Input label="Aceito perder até (R$)" value={stopLoss} onChange={(e) => setStopLoss(Number(e.target.value))} />
          <div className="flex gap-2">
            <button
              onClick={salvarEdicao}
              className="flex-1 bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium"
            >
              Salvar
            </button>
            <button
              onClick={fecharModal}
              className="flex-1 bg-destructive text-white py-2 rounded-md text-sm font-medium"
            >
              Cancelar
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}

export function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose?: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[340px] rounded-lg border bg-card shadow-lg p-10">
        {children}
      </div>
    </div>
  )
}

export function Input({
  label,
  value,
  onChange,
}: {
  label: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="mb-4">
      <label className="text-sm text-muted-foreground">{label}</label>
      <input
        type="number"
        value={value}
        onChange={onChange}
        className="no-spinner w-full mt-1 px-3 py-2 rounded-md bg-input border text-foreground outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  )
}
