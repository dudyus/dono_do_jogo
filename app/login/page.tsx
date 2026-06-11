"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthInput } from "@/components/auth-input"
import { AuthCheckbox } from "@/components/auth-checkbox"
import { AuthSidebar } from "@/components/auth-sidebar"
import { api, ApiError } from "@/lib/api"
import { salvarUsuario } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [manterConectado, setManterConectado] = useState(true)
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")
    setCarregando(true)
    try {
      const res = await api.login(email, senha)
      if (!res.sucesso || !res.usuario) {
        setErro(res.mensagem || "Email ou senha inválidos")
        return
      }
      salvarUsuario(res.usuario)
      router.push("/")
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Falha ao conectar à API")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthSidebar
        title="Bem vindo de volta!"
        subtitle="Entre na sua conta e continue de onde parou."
        ctaText="Ainda não tem uma conta? Cadastre-se"
        ctaButtonText="Cadastrar nova conta"
        ctaHref="/cadastro"
      />

      <div className="flex flex-col items-center justify-center bg-card p-8 lg:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-primary text-center mb-8">
            Acessar minha conta
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
              {carregando ? "Entrando..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6 lg:hidden">
            Ainda não tem uma conta?{" "}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 transition-colors mt-2"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
