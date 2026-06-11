"use client"

import { useState } from "react"
import type { Banca } from "@/lib/api"

interface BancaSidebarProps {
  banca: Banca
  onEditar: (meta: number, stopLoss: number) => Promise<void> | void
  onFechar: () => void
}

function brl(v: number | null) {
  return (v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export function BancaSidebar({ banca, onEditar, onFechar }: BancaSidebarProps) {
  const [editando, setEditando] = useState(false)
  const [meta, setMeta] = useState(banca.meta_diaria ?? 0)
  const [stopLoss, setStopLoss] = useState(banca.stop_loss ?? 0)

  const salvarEdicao = async () => {
    if (meta <= 0) return alert("Meta deve ser maior que 0")
    if (stopLoss < 0) return alert("Stop loss não pode ser negativo")
    await onEditar(meta, stopLoss)
    setEditando(false)
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
          <div className="text-xs text-muted-foreground">
            Meta {brl(banca.meta_diaria)} · Stop {brl(banca.stop_loss)}
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full max-w-[160px]">
          <button
            onClick={() => setEditando(true)}
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

      {editando && (
        <Modal onClose={() => setEditando(false)}>
          <h2 className="text-center text-primary font-semibold mb-4">
            Editar meta ou stop loss
          </h2>
          <Input label="Meta" value={meta} onChange={(e) => setMeta(Number(e.target.value))} />
          <Input label="Stop Loss" value={stopLoss} onChange={(e) => setStopLoss(Number(e.target.value))} />
          <div className="flex gap-2">
            <button
              onClick={salvarEdicao}
              className="flex-1 bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium"
            >
              Salvar
            </button>
            <button
              onClick={() => setEditando(false)}
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
