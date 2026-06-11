"use client"

import { Modal } from "./banca-sidebar"

interface MetaStopModalProps {
  tipo: "meta" | "stop"
  onFechar: () => void
  onContinuar: () => void
}

export function MetaStopModal({ tipo, onFechar, onContinuar }: MetaStopModalProps) {
  const meta = tipo === "meta"
  return (
    <Modal>
      <h2 className={`text-center font-semibold text-lg mb-2 ${meta ? "text-green-500" : "text-red-500"}`}>
        {meta ? "Meta atingida! 🎯" : "Stop loss atingido ⛔"}
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        {meta
          ? "Você bateu sua meta. Deseja fechar a banca e garantir o resultado, ou continuar apostando?"
          : "Você atingiu o stop loss. Recomendamos fechar a banca. Deseja fechar ou continuar?"}
      </p>
      <div className="flex gap-2">
        <button
          onClick={onFechar}
          className="flex-1 bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium"
        >
          Fechar banca
        </button>
        <button
          onClick={onContinuar}
          className="flex-1 bg-muted text-foreground py-2 rounded-md text-sm font-medium border border-border"
        >
          Continuar
        </button>
      </div>
    </Modal>
  )
}
