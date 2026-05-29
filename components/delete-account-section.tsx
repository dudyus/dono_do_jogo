"use client"

interface DeleteAccountSectionProps {
  onDelete?: () => void
}

export function DeleteAccountSection({ onDelete }: DeleteAccountSectionProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-border">
      <div>
        <h3 className="text-destructive-foreground font-medium">Deletar minha conta</h3>
        <p className="text-sm text-muted-foreground">
          Estou ciente e desejo excluir minha conta permanentemente
        </p>
      </div>
      <button
        onClick={onDelete}
        className="bg-destructive-foreground hover:bg-red-600 text-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
      >
        Deletar conta
      </button>
    </div>
  )
}
