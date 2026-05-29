"use client"

import { useState } from "react"

interface BancaSidebarProps {
  balance: number
}

type ModalType = "editar" | "saque" | "deposito" | "fechar" | null

export function BancaSidebar({ balance }: BancaSidebarProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  const formattedBalance = balance.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return (
    <>
      <div className="flex flex-col items-end gap-3">
        <div className="text-right">
          <span className="text-muted-foreground text-sm">Banca </span>
          <span className="text-primary font-semibold text-lg">
            {formattedBalance}
          </span>
        </div>

        <div className="flex flex-col gap-2 w-full max-w-[120px]">
          <ActionButton onClick={() => setActiveModal("editar")} variant="primary">
            Editar
          </ActionButton>

          <ActionButton onClick={() => setActiveModal("saque")} variant="primary">
            Saque
          </ActionButton>

          <ActionButton onClick={() => setActiveModal("deposito")} variant="primary">
            Deposito
          </ActionButton>

          <ActionButton onClick={() => setActiveModal("fechar")} variant="coral">
            Fechar banca
          </ActionButton>
        </div>
      </div>

      {/* MODAL */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          
          {/* BACKDROP COM BLUR */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          />

          {/* CONTEÚDO */}
          <div className="relative z-10 w-[320px] rounded-lg border border-border bg-background p-6 shadow-lg">
            <h2 className="text-lg font-semibold capitalize mb-2">
              {activeModal}
            </h2>

            <p className="text-sm text-muted-foreground mb-4">
              Aqui vai o conteúdo do {activeModal}
            </p>

            <button
              onClick={() => setActiveModal(null)}
              className="text-sm text-primary hover:underline"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  )
}

type ButtonVariant = "primary" | "teal" | "coral"

function ActionButton({
  children,
  variant,
  onClick,
}: {
  children: React.ReactNode
  variant: ButtonVariant
  onClick?: () => void
}) {
  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    teal: "bg-teal-600 text-white hover:bg-teal-700",
    coral: "bg-red-400 text-white hover:bg-red-500",
    // coral: "bg-destructive text-white hover:bg-destructive/90",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${variantStyles[variant]}`}
    >
      {children}
    </button>
  )
}