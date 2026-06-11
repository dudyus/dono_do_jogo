"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push("/")}
      className="text-foreground hover:text-primary transition-colors"
      aria-label="Voltar"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  )
}
