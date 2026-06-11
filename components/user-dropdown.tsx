"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = () => {
    // EXEMPLO: ajusta conforme teu projeto
    localStorage.removeItem("token") // ou o que tu usa
    router.push("/login")
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3"
      >
        <span className="hidden sm:block text-sm text-foreground">Augusto Muniz</span>
        <Avatar className="w-8 h-8">
          <AvatarImage src="/placeholder-avatar.jpg" alt="Augusto Muniz" />
          <AvatarFallback className="bg-muted text-muted-foreground text-xs">AM</AvatarFallback>
        </Avatar>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 bg-card border border-border rounded-md shadow-lg z-20 min-w-[150px]">
            <Link
              href="/perfil"
              className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Configurações
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              Sair
            </button>
          </div>
        </>
      )}
    </div>
  )
}