"use client"

import { useRouter } from "next/navigation"
import { BackButton } from "@/components/back-button"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileAvatar } from "@/components/profile-avatar"
import { ProfileField } from "@/components/profile-field"
import { DeleteAccountSection } from "@/components/delete-account-section"

export default function PerfilPage() {
  const router = useRouter()

  const handleSignOut = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader title="Informações de perfil" onSignOut={handleSignOut} />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="bg-card rounded-lg border border-border p-6 sm:p-8">
          <div className="mb-8">
            <ProfileAvatar
              name="Augusto Muniz"
              imageUrl="/placeholder-avatar.jpg"
            />
          </div>

          <div className="space-y-6">
            <ProfileField
              label="Nome"
              value="Augusto Muniz"
              buttonText="Editar nome"
            />

            <ProfileField
              label="Email"
              value="gutomuniz@gmail.com"
              buttonText="Editar email"
            />

            <ProfileField
              label="Senha"
              value="password123"
              type="password"
              buttonText="Mudar senha"
              buttonVariant="primary"
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
