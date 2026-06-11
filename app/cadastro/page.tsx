"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthInput } from "@/components/auth-input"
import { AuthCheckbox } from "@/components/auth-checkbox"
import { AuthSidebar } from "@/components/auth-sidebar"
import { api, ApiError } from "@/lib/api"
import { salvarUsuario } from "@/lib/auth"

export default function CadastroPage() {
  const router = useRouter()
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmSenha, setConfirmSenha] = useState("")
  const [manterConectado, setManterConectado] = useState(true)
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")
    if (senha !== confirmSenha) {
      setErro("As senhas não conferem")
      return
    }
    setCarregando(true)
    try {
      const res = await api.cadastro(nome, email, senha)
      salvarUsuario({ id: res.id, nome: res.nome, email: res.email, perfil_risco: null })
      router.push("/onboarding")
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Falha ao conectar à API")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthSidebar
        title="Comece agora mesmo!"
        subtitle="Crie sua conta e aproveite os recursos da nossa plataforma"
        ctaText="Já tem uma conta? Acesse"
        ctaButtonText="Acessar conta existente"
        ctaHref="/login"
      />

      <div className="flex flex-col items-center justify-center bg-card p-8 lg:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-primary text-center mb-8">
            Criar minha conta
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <AuthInput
              label="Nome"
              value={nome}
              onChange={setNome}
            />

            <AuthInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
            />

            <AuthInput
              label="Senha"
              type="password"
              value={senha}
              onChange={setSenha}
            />

            <AuthInput
              label="Confirme sua senha"
              type="password"
              value={confirmSenha}
              onChange={setConfirmSenha}
            />

            <AuthCheckbox
              label="Manter conectado"
              checked={manterConectado}
              onChange={setManterConectado}
            />

            {erro && (
              <p className="text-sm text-destructive text-center">{erro}</p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 transition-colors mt-2 disabled:opacity-60"
            >
              {carregando ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6 lg:hidden">
            Já tem uma conta?{" "}
            <a href="/login" className="text-primary hover:underline">
              Acessar conta existente
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
