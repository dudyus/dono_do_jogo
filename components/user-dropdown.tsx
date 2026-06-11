"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getUsuario, logout } from "@/lib/auth"

function initials(nome: string) {
  return nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [nome, setNome] = useState("")
  const router = useRouter()

  useEffect(() => {
    const u = getUsuario()
    if (u) setNome(u.nome)
  }, [])

  const handleSignOut = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3"
      >
        <span className="text-sm text-foreground">{nome}</span>
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
            {nome ? initials(nome) : "?"}
          </AvatarFallback>
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