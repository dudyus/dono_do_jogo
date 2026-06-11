"use client"

import { useState } from "react"

interface CriarBancaScreenProps {
  onCriar: (saldo: number, stopLoss: number, meta: number) => Promise<void> | void
  carregando?: boolean
  zerada?: boolean
}

export function CriarBancaScreen({ onCriar, carregando, zerada }: CriarBancaScreenProps) {
  const [saldo, setSaldo] = useState("")
  const [stopLoss, setStopLoss] = useState("")
  const [meta, setMeta] = useState("")
  const [erro, setErro] = useState("")

  const submeter = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")
    const s = Number(saldo)
    const sl = Number(stopLoss)
    const m = Number(meta)
    if (!s || s <= 0) return setErro("Informe um valor de banca válido")
    if (!m || m <= s) return setErro("A meta deve ser maior que a banca inicial")
    if (sl < 0 || sl >= s) return setErro("O stop loss deve ser entre 0 e a banca inicial")
    await onCriar(s, sl, m)
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <form
        onSubmit={submeter}
        className="w-full max-w-md bg-card border border-border rounded-lg p-8 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-primary text-center mb-2">
          {zerada ? "Banca zerada — abra uma nova" : "Abrir nova banca"}
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Defina o valor inicial, sua meta e o stop loss.
        </p>

        <Campo label="Valor da banca (R$)" value={saldo} onChange={setSaldo} placeholder="100" />
        <Campo label="Meta (R$)" value={meta} onChange={setMeta} placeholder="300" />
        <Campo label="Stop loss (R$)" value={stopLoss} onChange={setStopLoss} placeholder="50" />

        {erro && <p className="text-sm text-destructive mb-3">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {carregando ? "Criando..." : "Criar banca"}
        </button>
      </form>
    </div>
  )
}

function Campo({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="mb-4">
      <label className="text-sm text-muted-foreground">{label}</label>
      <input
        type="number"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="no-spinner w-full mt-1 px-3 py-2 rounded-md bg-input border text-foreground outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  )
}
