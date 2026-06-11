"use client"

import { useState } from "react"
import { Plus, Trash2, X } from "lucide-react"
import { BetInput } from "./bet-input"
import { ResultDropdown, type ResultType } from "./result-dropdown"

interface SubBet {
  id: string
  name: string
}

interface BetEntryProps {
  id: string
  aposta: string
  odd: string
  valor: string
  resultado: ResultType
  subBets?: SubBet[]
  onUpdate: (id: string, field: string, value: string | ResultType | SubBet[]) => void
  onDelete: (id: string) => void
}

export function BetEntry({
  id,
  aposta,
  odd,
  valor,
  resultado,
  subBets = [],
  onUpdate,
  onDelete,
}: BetEntryProps) {
  const addSubBet = () => {
    const newSubBet: SubBet = { id: crypto.randomUUID(), name: "" }
    onUpdate(id, "subBets", [...subBets, newSubBet])
  }

  const updateSubBet = (subId: string, value: string) => {
    const updated = subBets.map((sb) => (sb.id === subId ? { ...sb, name: value } : sb))
    onUpdate(id, "subBets", updated)
  }

  const removeSubBet = (subId: string) => {
    const updated = subBets.filter((sb) => sb.id !== subId)
    onUpdate(id, "subBets", updated)
  }

  return (
    <div className="bg-muted/30 border border-border rounded-lg p-4">
      <div className="flex flex-row items-end gap-4">
        <BetInput
          label="Aposta"
          value={aposta}
          onChange={(v) => onUpdate(id, "aposta", v)}
          className="flex-1 min-w-[180px]"
        />
        <BetInput
          label="ODD"
          value={odd}
          onChange={(v) => onUpdate(id, "odd", v)}
          className="w-20"
        />
        <BetInput
          label="Valor"
          value={valor}
          onChange={(v) => onUpdate(id, "valor", v)}
          className="w-20"
        />
        <div>
          <label className="block text-xs text-primary mb-1">Resultado</label>
          <div className="flex items-center gap-2">
            <ResultDropdown
              value={resultado}
              onChange={(v) => onUpdate(id, "resultado", v)}
            />
            <button
              type="button"
              onClick={() => onDelete(id)}
              className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
              aria-label="Deletar aposta"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {subBets.map((subBet) => (
        <div key={subBet.id} className="flex items-center gap-2 mt-3 ml-4">
          <input
            type="text"
            value={subBet.name}
            onChange={(e) => updateSubBet(subBet.id, e.target.value)}
            placeholder="Nome da sub-aposta"
            className="flex-1 max-w-[200px] px-3 py-2 bg-card border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => removeSubBet(subBet.id)}
            className="p-1 text-yellow-500 hover:text-yellow-400 transition-colors"
            aria-label="Remover sub-aposta"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addSubBet}
        className="flex items-center gap-1 mt-3 text-primary text-sm hover:text-primary/80 transition-colors"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  )
}
