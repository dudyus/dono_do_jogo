"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BackButton } from "@/components/back-button"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileAvatar } from "@/components/profile-avatar"
import { ProfileField } from "@/components/profile-field"
import { DeleteAccountSection } from "@/components/delete-account-section"
import { getUsuario, logout } from "@/lib/auth"
import type { Usuario } from "@/lib/api"

export default function PerfilPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  useEffect(() => {
    const u = getUsuario()
    if (!u) {
      router.push("/login")
      return
    }
    setUsuario(u)
  }, [router])

  const handleSignOut = () => {
    logout()
    router.push("/login")
  }

  if (!usuario) return null

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader title="Informações de perfil" onSignOut={handleSignOut} />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="bg-card rounded-lg border border-border p-6 sm:p-8">
          <div className="mb-8">
            <ProfileAvatar name={usuario.nome} />
          </div>

          <div className="space-y-6">
            <ProfileField
              label="Nome"
              value={usuario.nome}
              buttonText="Editar nome"
              onEdit={() => {/* futuro: modal de edição de nome */}}
            />

            <ProfileField
              label="Email"
              value={usuario.email}
              buttonText="Editar email"
              onEdit={() => {/* futuro: modal de edição de email */}}
            />

            <ProfileField
              label="Senha"
              value=""
              type="password"
              buttonText="Mudar senha"
              buttonVariant="primary"
              onEdit={() => {/* futuro: modal de alteração de senha */}}
            />
          </div>

          <div className="mt-8">
            <DeleteAccountSection />
          </div>
        </div>
      </main>
    </div>
  )
}
