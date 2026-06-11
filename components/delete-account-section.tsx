"use client"

import { useState } from "react"

interface DeleteAccountSectionProps {
  onDelete: () => void
  carregando?: boolean
}

export function DeleteAccountSection({ onDelete, carregando }: DeleteAccountSectionProps) {
  const [confirmando, setConfirmando] = useState(false)

  if (confirmando) {
    return (
      <div className="flex flex-col gap-3 pt-6 border-t border-border">
        <p className="text-sm text-destructive font-medium">
          Tem certeza? Esta ação é permanente e não pode ser desfeita.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setConfirmando(false)}
            disabled={carregando}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onDelete}
            disabled={carregando}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-60"
          >
            {carregando ? "Excluindo..." : "Sim, excluir minha conta"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-border">
      <div>
        <h3 className="text-destructive-foreground font-medium">Deletar minha conta</h3>
        <p className="text-sm text-muted-foreground">
          Estou ciente e desejo excluir minha conta permanentemente
        </p>
      </div>
      <button
        onClick={() => setConfirmando(true)}
        className="bg-destructive-foreground hover:bg-red-600 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
      >
        Deletar conta
      </button>
    </div>
  )
}
