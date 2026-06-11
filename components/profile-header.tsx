"use client"

import { ArrowLeft, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProfileHeaderProps {
  title: string
  onSignOut?: () => void
}

export function ProfileHeader({ title, onSignOut }: ProfileHeaderProps) {
  const router = useRouter()

  return (
    <header className="bg-secondary px-4 sm:px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="hidden sm:inline">Sair da conta</span>
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
