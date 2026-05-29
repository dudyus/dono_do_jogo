"use client"

import { useState } from "react"

interface BancaSidebarProps {
  balance: number
}

type ModalType = "editar" | "saque" | "deposito" | "fechar" | null

export function BancaSidebar({ balance }: BancaSidebarProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [saldoAtual, setSaldoAtual] = useState(balance)
  const [meta, setMeta] = useState(300)
  const [stopLoss, setStopLoss] = useState(20)
  const [valorSaque, setValorSaque] = useState("")
  const [valorDeposito, setValorDeposito] = useState("")

  const handleSaveEdit = () => {
    if (meta <= 0) return alert("Meta deve ser maior que 0")
    if (stopLoss < 0) return alert("Stop loss não pode ser negativo")

    console.log("SALVANDO:", { meta, stopLoss })
    setActiveModal(null)
  }

  const handleSaque = () => {
    const valor = Number(valorSaque)

    if (!valor || valor <= 0) {
      return alert("Informe um valor válido")
    }

    if (valor > saldoAtual) {
      return alert("Saldo insuficiente")
    }

    setSaldoAtual((prev) => prev - valor)

    setActiveModal(null)
    setValorSaque("")
  }

  const handleDeposito = () => {
    const valor = Number(valorDeposito)

    if (!valor || valor <= 0) {
      return alert("Informe um valor válido")
    }

    setSaldoAtual((prev) => prev + valor)

    setActiveModal(null)
    setValorDeposito("")
  }

  return (
    <>
      <div className="flex flex-col items-end gap-3">
        <div className="text-right">
          <span className="text-muted-foreground text-sm">Banca </span>
          <span className="text-primary font-semibold text-lg">
            {saldoAtual.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>

        <div className="flex flex-col gap-2 w-full max-w-[140px]">
          <ActionButton onClick={() => setActiveModal("editar")} variant="primary">
            Editar
          </ActionButton>

          <ActionButton onClick={() => setActiveModal("saque")} variant="primary">
            Saque
          </ActionButton>

          <ActionButton onClick={() => setActiveModal("deposito")} variant="primary">
            Depósito
          </ActionButton>

          <ActionButton onClick={() => setActiveModal("fechar")} variant="coral">
            Fechar banca
          </ActionButton>
        </div>
      </div>

      {/* MODAL */}
      {activeModal === "editar" && (
        <Modal onClose={() => setActiveModal(null)}>
          <h2 className="modal-title text-center text-primary font-semibold mb-4">
            Editar meta ou stop loss
          </h2>

          <Input
            label="Meta"
            value={meta}
            onChange={(e) => setMeta(Number(e.target.value))}
          />

          <Input
            label="Stop Loss"
            value={stopLoss}
            onChange={(e) => setStopLoss(Number(e.target.value))}
          />

          <ModalActions
            onConfirm={handleSaveEdit}
            onCancel={() => setActiveModal(null)}
          />
        </Modal>
      )}

      {/* MODAL */}
      {activeModal === "saque" && (
        <Modal onClose={() => setActiveModal(null)}>
          <h2 className="modal-title text-center text-primary font-semibold mb-4">
            Insira o valor que deseja sacar da banca
          </h2>

          <Input
            label="Valor de saque"
            value={valorSaque}
            onChange={(e) => setValorSaque(e.target.value)}
          />

          <ModalActions
            onConfirm={handleSaque}
            onCancel={() => setActiveModal(null)}
          />
        </Modal>
      )}

      {/* MODAL */}
      {activeModal === "deposito" && (
        <Modal onClose={() => setActiveModal(null)}>
          <h2 className="modal-title text-center text-primary font-semibold mb-4">
            Insira o valor que deseja depositar na banca
          </h2>

          <Input
            label="Valor do depósito"
            value={valorDeposito}
            onChange={(e) => setValorDeposito(e.target.value)}
          />

          <ModalActions
            onConfirm={handleDeposito}
            onCancel={() => setActiveModal(null)}
          />
        </Modal>
      )}
    </>
  )
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-[340px] rounded-lg border bg-card shadow-lg p-10">
        {children}
      </div>
    </div>
  )
}

function Input({
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

function ModalActions({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onConfirm}
        className="flex-1 bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium"
      >
        Salvar
      </button>

      <button
        onClick={onCancel}
        className="flex-1 bg-destructive text-white py-2 rounded-md text-sm font-medium"
      >
        Cancelar
      </button>
    </div>
  )
}

type ButtonVariant = "primary" | "coral"

function ActionButton({
  children,
  variant,
  onClick,
}: {
  children: React.ReactNode
  variant: ButtonVariant
  onClick?: () => void
}) {
  const styles = {
    primary: "bg-primary text-primary-foreground",
    coral: "bg-destructive text-white",
  }

  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-md text-sm font-medium ${styles[variant]}`}
    >
      {children}
    </button>
  )
}